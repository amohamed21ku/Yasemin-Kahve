// Certificate.jsx - the printable certificate (fixed A4 size in CSS pixels)
import React, { forwardRef, useLayoutEffect, useRef } from 'react';
import {
  ASSETS,
  COURSE_COLORS,
  formatCertDate,
  formatVerificationCode,
} from './certificateDesign';
import './Certificate.css';

// Shrinks a single-line field until it fits its width
const useFitText = (ref, text, max, min, width) => {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let size = max;
    el.style.fontSize = `${size}px`;
    while (el.scrollWidth > width && size > min) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
  }, [ref, text, max, min, width]);
};

const QrBlock = ({ qrDataUrl, code, className }) => (
  <div className={className}>
    {qrDataUrl ? <img src={qrDataUrl} alt="Verification QR code" /> : <div className="ykc-qr-empty" />}
    <span className="ykc-qr-cap">Scan to verify</span>
    {code ? <span className="ykc-qr-code">{formatVerificationCode(code)}</span> : null}
  </div>
);

const ModernCertificate = ({ cert, qrDataUrl }, ref) => {
  const kind = cert.courseKey === 'sensory' ? 'sensory' : 'green';
  const nameRef = useRef(null);
  const courseRef = useRef(null);
  useFitText(nameRef, cert.recipientName, 32, 18, 650);
  useFitText(courseRef, cert.courseTitle, 25, 15, 650);
  const band = COURSE_COLORS[kind].band;

  return (
    <div className="ykc ykc-modern" ref={ref}>
      <svg className="ykc-m-bg" viewBox="0 0 794 1123" width="794" height="1123" aria-hidden="true">
        <polygon points="360,0 672,0 0,1100 0,600" fill={band} />
        <line x1="728" y1="0" x2="0" y2="1190" stroke="#231A13" strokeWidth="1.2" opacity="0.5" />
      </svg>
      <img className="ykc-m-logo" src={ASSETS.logo} alt="Yasemin Kahve Academy" crossOrigin="anonymous" />
      {cert.verifiedLine ? <div className="ykc-m-verified">{`— ${cert.verifiedLine}`}</div> : null}
      <QrBlock className="ykc-m-qr" qrDataUrl={qrDataUrl} code={cert.verificationCode} />

      <div className="ykc-m-head">
        <div className="ykc-m-eyebrow">Yasemin Kahve Academy</div>
        <div className="ykc-m-title">Certificate<br />of Completion</div>
      </div>

      <div className="ykc-m-fields">
        <div>
          <div className="ykc-m-lbl">This is to recognize that</div>
          <div className="ykc-m-val ykc-m-name" ref={nameRef}>{cert.recipientName}</div>
        </div>
        <div>
          <div className="ykc-m-lbl">has successfully completed the course</div>
          <div className="ykc-m-val ykc-m-course" ref={courseRef}>{cert.courseTitle}</div>
        </div>
      </div>

      <div className="ykc-m-grid">
        <div><div className="v">{cert.instructorName}</div><div className="l">Instructor</div></div>
        <div><div className="v">{formatCertDate(cert.issueDate)}</div><div className="l">Date</div></div>
        <div><div className="v">{cert.certificateNo}</div><div className="l">Certificate Number</div></div>
      </div>

      <img className="ykc-m-icon" src={ASSETS.courseIcon[kind]} alt="" crossOrigin="anonymous" />
    </div>
  );
};

const ClassicCertificate = ({ cert, qrDataUrl }, ref) => {
  const kind = cert.courseKey === 'sensory' ? 'sensory' : 'green';
  const nameRef = useRef(null);
  const courseRef = useRef(null);
  useFitText(nameRef, cert.recipientName, 76, 40, 800);
  useFitText(courseRef, cert.courseTitle, 31, 20, 820);

  return (
    <div className="ykc ykc-classic" ref={ref}>
      <div className="ykc-c-f1" /><div className="ykc-c-f2" /><div className="ykc-c-f3" />
      {['tl', 'tr', 'bl', 'br'].map((p) => (
        <img key={p} className={`ykc-c-cn ${p}`} src={ASSETS.corner} alt="" crossOrigin="anonymous" />
      ))}
      <div className="ykc-c-body">
        <img className="ykc-c-logo" src={ASSETS.logo} alt="Yasemin Kahve Academy" crossOrigin="anonymous" />
        {cert.verifiedLine ? <div className="ykc-c-verified">{cert.verifiedLine}</div> : null}
        <div className="ykc-c-title">Certificate</div>
        <div className="ykc-c-sub"><i /><span>OF COMPLETION</span><i /></div>
        <div className="ykc-c-lead">This certificate is proudly presented to</div>
        <div className="ykc-c-name" ref={nameRef}>{cert.recipientName}</div>
        <div className="ykc-c-rule" />
        <div className="ykc-c-lead2">for successfully completing the</div>
        <div className="ykc-c-course" ref={courseRef}>{cert.courseTitle}</div>
        {cert.description ? <div className="ykc-c-desc">{cert.description}</div> : null}
      </div>
      <QrBlock className="ykc-c-qr" qrDataUrl={qrDataUrl} code={cert.verificationCode} />
      <div className="ykc-c-sig l"><div className="who">{formatCertDate(cert.issueDate)}</div><div className="ln" /><div className="role">DATE</div></div>
      <div className="ykc-c-sig r"><div className="who">{cert.instructorName}</div><div className="ln" /><div className="role">INSTRUCTOR</div></div>
      <div className="ykc-c-meta">CERTIFICATE NO. <b>{cert.certificateNo}</b></div>
      <img className="ykc-c-seal" src={ASSETS.seal[kind]} alt="" crossOrigin="anonymous" />
    </div>
  );
};

const ModernRef = forwardRef(ModernCertificate);
const ClassicRef = forwardRef(ClassicCertificate);

const Certificate = forwardRef(({ cert, qrDataUrl }, ref) =>
  cert.design === 'classic'
    ? <ClassicRef ref={ref} cert={cert} qrDataUrl={qrDataUrl} />
    : <ModernRef ref={ref} cert={cert} qrDataUrl={qrDataUrl} />
);

export default Certificate;
