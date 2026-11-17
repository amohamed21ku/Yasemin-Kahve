// certificateExport.js - QR codes and PDF/PNG export for certificates
import { createElement, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import QRCode from 'qrcode';
import Certificate from './Certificate';
import { DESIGNS, safeFileName, verificationUrl } from './certificateDesign';

/* ---------- QR ---------- */
export const makeQrDataUrl = (code) =>
  code
    ? QRCode.toDataURL(verificationUrl(code), {
        errorCorrectionLevel: 'M',
        margin: 0,
        width: 360,
        color: { dark: '#231A13', light: '#FFFFFF' },
      })
    : Promise.resolve('');

export const useQrDataUrl = (code) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let alive = true;
    makeQrDataUrl(code).then((u) => alive && setUrl(u)).catch(() => alive && setUrl(''));
    return () => { alive = false; };
  }, [code]);
  return url;
};

/* ---------- Export ---------- */
const waitForImages = (root) =>
  Promise.all(
    [...root.querySelectorAll('img')].map((img) =>
      img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise((res) => { img.onload = res; img.onerror = res; })
    )
  );

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

// Fonts used on the certificates. html-to-image cannot read Google's cross-origin stylesheet itself,
// so the @font-face rules are fetched once and inlined as data URLs.
const CERT_FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=block';

const toDataUrl = (blob) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = rej;
  r.readAsDataURL(blob);
});

let fontCssPromise = null;
const getFontEmbedCss = () => {
  if (!fontCssPromise) {
    fontCssPromise = (async () => {
      const css = await (await fetch(CERT_FONTS_CSS)).text();
      // Keep the Latin and Latin Extended subsets (covers Turkish ş ğ ı İ); drop Cyrillic, Greek, Vietnamese.
      const blocks = css.match(/@font-face\s*{[^}]*}/g) || [];
      const wanted = blocks.filter((b) => {
        const range = (b.match(/unicode-range:\s*([^;]+)/) || [])[1] || '';
        return !range || /U\+0000-00FF|U\+0100-02/i.test(range);
      });
      const out = await Promise.all(wanted.map(async (block) => {
        const url = (block.match(/url\(([^)]+)\)/) || [])[1];
        if (!url) return block;
        const clean = url.replace(/["']/g, '');
        const data = await toDataUrl(await (await fetch(clean)).blob());
        return block.replace(url, `"${data}"`);
      }));
      return out.join('\n');
    })().catch((err) => {
      console.warn('Certificate fonts could not be embedded', err);
      fontCssPromise = null;
      return '';
    });
  }
  return fontCssPromise;
};

// Renders one certificate off-screen and returns a high-resolution canvas.
// html-to-image draws through the browser's own layout engine, so text sits exactly as on screen.
export const renderCertificateCanvas = async (cert, scale = 3) => {
  const [{ toCanvas }, qr, fontEmbedCSS] = await Promise.all([
    import('html-to-image'), makeQrDataUrl(cert.verificationCode), getFontEmbedCss(),
  ]);
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = 'position:fixed;left:0;top:0;z-index:-1;opacity:0;pointer-events:none;';
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    flushSync(() => root.render(createElement(Certificate, { cert, qrDataUrl: qr })));
    await document.fonts.ready;
    await waitForImages(host);
    await nextFrame();
    const el = host.firstElementChild;
    const { width, height } = DESIGNS[cert.design] || DESIGNS.modern;
    const opts = {
      pixelRatio: scale,
      width,
      height,
      cacheBust: false,
      backgroundColor: cert.design === 'classic' ? '#FCF8EF' : '#FFFDF9',
      style: { opacity: '1' },
      fontEmbedCSS,
    };
    // The first pass warms the font and image cache (a known Safari quirk); the second is the real one.
    await toCanvas(el, { ...opts, pixelRatio: 0.2 }).catch(() => null);
    return await toCanvas(el, opts);
  } finally {
    root.unmount();
    host.remove();
  }
};

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};

export const certificateFileName = (cert, ext) =>
  `${safeFileName(cert.recipientName)}_${safeFileName(cert.courseTitle)}_${cert.certificateNo || 'draft'}.${ext}`;

// One PDF with a page per certificate. onProgress(i, total) is called before each page.
export const downloadCertificatesPdf = async (certs, filename, onProgress) => {
  const { jsPDF } = await import('jspdf');
  let pdf = null;
  for (let i = 0; i < certs.length; i += 1) {
    onProgress?.(i + 1, certs.length);
    const cert = certs[i];
    const { orientation } = DESIGNS[cert.design] || DESIGNS.modern;
    const canvas = await renderCertificateCanvas(cert);
    const [w, h] = orientation === 'landscape' ? [297, 210] : [210, 297];
    if (!pdf) pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4', compress: true });
    else pdf.addPage('a4', orientation);
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, w, h);
  }
  if (!pdf) return;
  pdf.setProperties({ title: filename.replace(/\.pdf$/, ''), creator: 'Yasemin Kahve Academy' });
  saveBlob(pdf.output('blob'), filename);
};

export const downloadCertificatePdf = (cert) => downloadCertificatesPdf([cert], certificateFileName(cert, 'pdf'));

export const downloadCertificatePng = async (cert) => {
  const canvas = await renderCertificateCanvas(cert);
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
  saveBlob(blob, certificateFileName(cert, 'png'));
};
