// CertificateVerify.jsx - public page the certificate QR code opens: /verify/:code
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, ShieldAlert, SearchX, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';
import { getCertificate } from '../../services/certificateService';
import {
  ASSETS, formatCertDate, formatVerificationCode, normalizeVerificationCode,
} from '../../certificates/certificateDesign';
import ScaledCertificate from '../../certificates/ScaledCertificate';
import { downloadCertificatePdf, useQrDataUrl } from '../../certificates/certificateExport';
import './CertificateVerify.css';

const TEXT = {
  en: {
    checking: 'Checking certificate…',
    verified: 'Verified certificate',
    verifiedSub: 'This certificate was issued by Yasemin Kahve Academy and is valid.',
    revoked: 'Certificate revoked',
    revokedSub: 'Yasemin Kahve Academy has revoked this certificate. It is no longer valid.',
    notFound: 'No certificate found',
    notFoundSub: 'We could not find a certificate with this verification code. Check the code and try again.',
    errorTitle: 'Verification unavailable',
    error: 'We could not check this certificate right now. Please try again in a moment.',
    holder: 'Awarded to', course: 'Course', date: 'Date of issue', number: 'Certificate number',
    instructor: 'Instructor', code: 'Verification code', issuer: 'Issued by', reason: 'Reason',
    download: 'Download certificate (PDF)', preparing: 'Preparing PDF…',
    lookupTitle: 'Verify a certificate',
    lookupSub: 'Scan the QR code on a Yasemin Kahve Academy certificate, or enter the verification code printed under it.',
    lookupPlaceholder: 'e.g. K7QX-M2PA-9D', lookupBtn: 'Verify', another: 'Verify another certificate', home: 'yaseminkahve.com',
  },
  tr: {
    checking: 'Sertifika kontrol ediliyor…',
    verified: 'Doğrulanmış sertifika',
    verifiedSub: 'Bu sertifika Yasemin Kahve Akademi tarafından verilmiştir ve geçerlidir.',
    revoked: 'Sertifika iptal edildi',
    revokedSub: 'Yasemin Kahve Akademi bu sertifikayı iptal etmiştir. Artık geçerli değildir.',
    notFound: 'Sertifika bulunamadı',
    notFoundSub: 'Bu doğrulama koduna ait bir sertifika bulamadık. Kodu kontrol edip tekrar deneyin.',
    errorTitle: 'Doğrulama yapılamadı',
    error: 'Sertifika şu anda kontrol edilemiyor. Lütfen biraz sonra tekrar deneyin.',
    holder: 'Sertifika sahibi', course: 'Eğitim', date: 'Veriliş tarihi', number: 'Sertifika numarası',
    instructor: 'Eğitmen', code: 'Doğrulama kodu', issuer: 'Veren kurum', reason: 'Neden',
    download: 'Sertifikayı indir (PDF)', preparing: 'PDF hazırlanıyor…',
    lookupTitle: 'Sertifika doğrula',
    lookupSub: 'Yasemin Kahve Akademi sertifikasındaki QR kodu okutun veya altında yazan doğrulama kodunu girin.',
    lookupPlaceholder: 'örn. K7QX-M2PA-9D', lookupBtn: 'Doğrula', another: 'Başka bir sertifika doğrula', home: 'yaseminkahve.com',
  },
};

const useNoIndex = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Certificate verification · Yasemin Kahve Academy';
    return () => { meta.remove(); document.title = prevTitle; };
  }, []);
};

const Lookup = ({ t, compact }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const code = normalizeVerificationCode(value);
    if (code) navigate(`/verify/${code}`);
  };
  return (
    <form className={`cv-lookup ${compact ? 'compact' : ''}`} onSubmit={submit}>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={t.lookupPlaceholder} aria-label={t.code} autoCapitalize="characters" spellCheck="false" />
      <button type="submit">{t.lookupBtn}</button>
    </form>
  );
};

const Shell = ({ children, language, setLanguage }) => (
  <div className="cv-page">
    <header className="cv-top">
      <Link to="/" className="cv-brand"><img src={ASSETS.logo} alt="Yasemin Kahve Academy" /></Link>
      <div className="cv-lang">
        <button className={language === 'tr' ? 'on' : ''} onClick={() => setLanguage('tr')}>TR</button>
        <button className={language === 'en' ? 'on' : ''} onClick={() => setLanguage('en')}>EN</button>
      </div>
    </header>
    <main className="cv-main">{children}</main>
    <footer className="cv-foot"><Link to="/">yaseminkahve.com</Link></footer>
  </div>
);

const CertificateVerify = () => {
  const { code: rawCode } = useParams();
  const { language, setLanguage } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const code = normalizeVerificationCode(rawCode || '');
  const [state, setState] = useState({ status: code ? 'loading' : 'idle', cert: null });
  const [downloading, setDownloading] = useState(false);
  const qr = useQrDataUrl(state.cert ? state.cert.id : '');
  useNoIndex();

  useEffect(() => {
    if (!code) { setState({ status: 'idle', cert: null }); return undefined; }
    let alive = true;
    setState({ status: 'loading', cert: null });
    getCertificate(code)
      .then((cert) => alive && setState({ status: cert ? (cert.status === 'revoked' ? 'revoked' : 'valid') : 'notfound', cert }))
      .catch((err) => { console.error(err); if (alive) setState({ status: 'error', cert: null }); });
    return () => { alive = false; };
  }, [code]);

  const shellProps = { language, setLanguage };

  if (state.status === 'idle') {
    return (
      <Shell {...shellProps}>
        <section className="cv-card cv-intro">
          <BadgeCheck size={40} className="cv-intro-icon" />
          <h1>{t.lookupTitle}</h1>
          <p>{t.lookupSub}</p>
          <Lookup t={t} />
        </section>
      </Shell>
    );
  }

  if (state.status === 'loading') {
    return <Shell {...shellProps}><div className="cv-loading"><Loader2 className="cv-spin" size={28} /> {t.checking}</div></Shell>;
  }

  if (state.status === 'notfound' || state.status === 'error') {
    return (
      <Shell {...shellProps}>
        <section className="cv-card cv-banner cv-bad">
          <SearchX size={34} />
          <div>
            <h1>{state.status === 'error' ? t.errorTitle : t.notFound}</h1>
            <p>{state.status === 'error' ? t.error : t.notFoundSub}</p>
            <p className="cv-code-line">{t.code}: <b>{formatVerificationCode(code)}</b></p>
          </div>
        </section>
        <section className="cv-card cv-again"><h2>{t.lookupTitle}</h2><Lookup t={t} compact /></section>
      </Shell>
    );
  }

  const { cert } = state;
  const valid = state.status === 'valid';

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadCertificatePdf(cert); } finally { setDownloading(false); }
  };

  return (
    <Shell {...shellProps}>
      <section className={`cv-card cv-banner ${valid ? 'cv-ok' : 'cv-bad'}`}>
        {valid ? <BadgeCheck size={40} /> : <ShieldAlert size={40} />}
        <div>
          <h1>{valid ? t.verified : t.revoked}</h1>
          <p>{valid ? t.verifiedSub : t.revokedSub}</p>
        </div>
      </section>

      <section className="cv-card cv-details">
        <dl>
          <div className="wide"><dt>{t.holder}</dt><dd className="cv-holder">{cert.recipientName}</dd></div>
          <div><dt>{t.course}</dt><dd>{cert.courseTitle}</dd></div>
          <div><dt>{t.date}</dt><dd>{formatCertDate(cert.issueDate)}</dd></div>
          <div><dt>{t.number}</dt><dd className="mono">{cert.certificateNo}</dd></div>
          <div><dt>{t.code}</dt><dd className="mono">{formatVerificationCode(cert.id)}</dd></div>
          {cert.instructorName ? <div><dt>{t.instructor}</dt><dd>{cert.instructorName}</dd></div> : null}
          <div><dt>{t.issuer}</dt><dd>Yasemin Kahve Academy{cert.verifiedLine ? ` · ${cert.verifiedLine}` : ''}</dd></div>
          {!valid && cert.revokedReason ? <div className="wide"><dt>{t.reason}</dt><dd>{cert.revokedReason}</dd></div> : null}
        </dl>
      </section>

      <section className={`cv-cert ${valid ? '' : 'is-revoked'}`}>
        <ScaledCertificate cert={cert} qrDataUrl={qr} maxHeight={cert.design === 'classic' ? 640 : 900} />
        {!valid && <div className="cv-void">{t.revoked}</div>}
      </section>

      <div className="cv-actions">
        {valid && (
          <button className="cv-btn" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="cv-spin" size={18} /> : <Download size={18} />}
            {downloading ? t.preparing : t.download}
          </button>
        )}
        <Link className="cv-link" to="/verify"><ArrowLeft size={16} /> {t.another}</Link>
      </div>
    </Shell>
  );
};

export default CertificateVerify;
