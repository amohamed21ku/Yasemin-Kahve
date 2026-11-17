// CertificateManagement.jsx - issue, list, download and revoke academy certificates
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award, Download, ExternalLink, Link2, RefreshCw, Search, ShieldCheck, ShieldOff, RotateCcw, Plus, ListChecks, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../AuthContext';
import {
  issueCertificate, listCertificates, setCertificateStatus,
} from '../../../services/certificateService';
import {
  COURSE_PRESETS, DESIGNS, DEFAULT_VERIFIED_LINE, formatCertDate, formatVerificationCode, todayISO, verificationUrl,
} from '../../../certificates/certificateDesign';
import ScaledCertificate from '../../../certificates/ScaledCertificate';
import {
  downloadCertificatePdf, downloadCertificatePng, downloadCertificatesPdf,
} from '../../../certificates/certificateExport';
import './CertificateManagement.css';

const emptyForm = () => ({
  courseKey: 'green',
  courseTitle: COURSE_PRESETS.green.title,
  description: COURSE_PRESETS.green.description,
  design: 'modern',
  names: '',
  issueDate: todayISO(),
  instructorName: '',
  verifiedLine: DEFAULT_VERIFIED_LINE,
});

const CertificateManagement = () => {
  const { currentUser, getUserData } = useAuth();
  const [view, setView] = useState('issue');
  const [form, setForm] = useState(emptyForm);
  const [issuing, setIssuing] = useState(false);
  const [progress, setProgress] = useState('');
  const [justIssued, setJustIssued] = useState([]);
  const [error, setError] = useState('');

  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [busyId, setBusyId] = useState('');
  const [toast, setToast] = useState('');
  const [issuerName, setIssuerName] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    getUserData(currentUser.uid).then((u) => {
      const name = u?.displayName || [u?.firstName, u?.lastName].filter(Boolean).join(' ');
      setIssuerName(name || currentUser.email || '');
    });
  }, [currentUser, getUserData]);

  const load = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      setCerts(await listCertificates());
    } catch (e) {
      console.error('Error loading certificates:', e);
      setListError('Could not load certificates. Check that the Firestore rules for "certificates" are published.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2600); };

  const names = useMemo(
    () => form.names.split('\n').map((n) => n.trim()).filter(Boolean),
    [form.names]
  );

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickCourse = (key) => {
    setForm((f) => {
      const old = COURSE_PRESETS[f.courseKey];
      const next = COURSE_PRESETS[key];
      return {
        ...f,
        courseKey: key,
        courseTitle: f.courseTitle === old.title ? next.title : f.courseTitle,
        description: f.description === old.description ? next.description : f.description,
      };
    });
  };

  const previewCert = {
    recipientName: names[0] || 'Graduate Name',
    courseKey: form.courseKey,
    courseTitle: form.courseTitle,
    description: form.description,
    instructorName: form.instructorName,
    issueDate: form.issueDate,
    design: form.design,
    verifiedLine: form.verifiedLine,
    certificateNo: `YKA-${COURSE_PRESETS[form.courseKey].prefix}-${(form.issueDate || '').slice(0, 4)}-····`,
    verificationCode: '',
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setError('');
    if (!names.length) { setError('Add at least one graduate name.'); return; }
    if (!form.courseTitle.trim()) { setError('Enter the course name.'); return; }
    if (!form.issueDate) { setError('Choose the date of issue.'); return; }
    setIssuing(true);
    const issued = [];
    try {
      for (let i = 0; i < names.length; i += 1) {
        setProgress(`Issuing ${i + 1} of ${names.length}…`);
        issued.push(await issueCertificate({ ...form, recipientName: names[i] }, {
          uid: currentUser?.uid, email: currentUser?.email, name: issuerName,
        }));
      }
      setJustIssued(issued);
      setForm((f) => ({ ...f, names: '' }));
      setCerts((c) => [...issued, ...c]);
      setProgress('Preparing PDF…');
      await downloadCertificatesPdf(
        issued,
        issued.length === 1 ? `${issued[0].certificateNo}.pdf` : `${issued[0].courseTitle}_${issued.length}-certificates.pdf`.replace(/\s+/g, '-'),
        (n, t) => setProgress(`Rendering PDF page ${n} of ${t}…`)
      );
    } catch (err) {
      console.error('Issue error:', err);
      setError(
        issued.length
          ? `Issued ${issued.length} of ${names.length}, then stopped: ${err.message}`
          : `Could not issue the certificate: ${err.message}`
      );
      if (issued.length) setJustIssued(issued);
    } finally {
      setIssuing(false);
      setProgress('');
    }
  };

  const copyLink = async (cert) => {
    const url = verificationUrl(cert.verificationCode || cert.id);
    try { await navigator.clipboard.writeText(url); flash('Verification link copied'); }
    catch { window.prompt('Copy this verification link:', url); }
  };

  const download = async (cert, type = 'pdf') => {
    setBusyId(cert.id);
    try {
      if (type === 'png') await downloadCertificatePng(cert);
      else await downloadCertificatePdf(cert);
    } catch (e) {
      console.error(e);
      flash('Could not create the file');
    } finally { setBusyId(''); }
  };

  const toggleStatus = async (cert) => {
    if (cert.status === 'revoked') {
      if (!window.confirm(`Reinstate certificate ${cert.certificateNo} for ${cert.recipientName}?`)) return;
      await applyStatus(cert, 'valid', '');
    } else {
      const reason = window.prompt(
        `Revoke certificate ${cert.certificateNo} for ${cert.recipientName}?\nThe verification page will show it as revoked.\n\nReason (optional):`,
        ''
      );
      if (reason === null) return;
      await applyStatus(cert, 'revoked', reason);
    }
  };

  const applyStatus = async (cert, status, reason) => {
    setBusyId(cert.id);
    try {
      await setCertificateStatus(cert.id, status, { reason, user: currentUser });
      setCerts((list) => list.map((c) => (c.id === cert.id ? { ...c, status, revokedReason: reason } : c)));
      flash(status === 'revoked' ? 'Certificate revoked' : 'Certificate reinstated');
    } catch (e) {
      console.error(e);
      flash('Could not update the certificate');
    } finally { setBusyId(''); }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr');
    return certs.filter((c) => {
      if (courseFilter !== 'all' && c.courseKey !== courseFilter) return false;
      if (statusFilter !== 'all' && (c.status || 'valid') !== statusFilter) return false;
      if (!q) return true;
      return [c.recipientName, c.certificateNo, c.courseTitle, c.instructorName, c.id, formatVerificationCode(c.id)]
        .filter(Boolean).some((v) => String(v).toLocaleLowerCase('tr').includes(q));
    });
  }, [certs, search, courseFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: certs.length,
    valid: certs.filter((c) => (c.status || 'valid') === 'valid').length,
    revoked: certs.filter((c) => c.status === 'revoked').length,
  }), [certs]);

  return (
    <div className="cm-wrap">
      <header className="cm-header">
        <div className="cm-title">
          <span className="cm-title-icon"><Award size={22} /></span>
          <div>
            <h1>Certificates</h1>
            <p>Issue verified course certificates. Each one carries a QR code that opens its page on yaseminkahve.com.</p>
          </div>
        </div>
        <div className="cm-stats">
          <div><b>{stats.total}</b><span>Issued</span></div>
          <div><b>{stats.valid}</b><span>Valid</span></div>
          <div><b>{stats.revoked}</b><span>Revoked</span></div>
        </div>
      </header>

      <div className="cm-tabs" role="tablist">
        <button role="tab" aria-selected={view === 'issue'} className={view === 'issue' ? 'on' : ''} onClick={() => setView('issue')}>
          <Plus size={16} /> Issue certificates
        </button>
        <button role="tab" aria-selected={view === 'list'} className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>
          <ListChecks size={16} /> Issued certificates <span className="cm-count">{stats.total}</span>
        </button>
      </div>

      {view === 'issue' && (
        <div className="cm-issue">
          <form className="cm-card cm-form" onSubmit={handleIssue}>
            <div className="cm-group">
              <span className="cm-label">Course</span>
              <div className="cm-seg">
                {Object.values(COURSE_PRESETS).map((c) => (
                  <button type="button" key={c.key} className={form.courseKey === c.key ? 'on' : ''} onClick={() => pickCourse(c.key)}>
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
            <label className="cm-field">Course name on certificate
              <input value={form.courseTitle} onChange={setField('courseTitle')} />
            </label>
            <div className="cm-group">
              <span className="cm-label">Design</span>
              <div className="cm-seg">
                {Object.entries(DESIGNS).map(([k, d]) => (
                  <button type="button" key={k} className={form.design === k ? 'on' : ''} onClick={() => setForm((f) => ({ ...f, design: k }))}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="cm-field">Graduate names
              <textarea rows={5} value={form.names} onChange={setField('names')} placeholder={'One name per line\nAyşe Yılmaz\nMehmet Demir'} />
              <small>{names.length ? `${names.length} certificate${names.length > 1 ? 's' : ''} will be issued` : 'One certificate is issued per line.'}</small>
            </label>
            <div className="cm-row">
              <label className="cm-field">Date of issue
                <input type="date" value={form.issueDate} onChange={setField('issueDate')} />
              </label>
              <label className="cm-field">Instructor
                <input value={form.instructorName} onChange={setField('instructorName')} placeholder="Blank = sign by hand" />
              </label>
            </div>
            <label className="cm-field">Line under the logo
              <input value={form.verifiedLine} onChange={setField('verifiedLine')} />
            </label>
            {form.design === 'classic' && (
              <label className="cm-field">Course description
                <textarea rows={3} value={form.description} onChange={setField('description')} />
              </label>
            )}

            {error && <div className="cm-error" role="alert">{error}</div>}
            <button type="submit" className="cm-primary" disabled={issuing}>
              <Award size={18} />
              {issuing ? progress || 'Working…' : `Issue ${names.length > 1 ? `${names.length} certificates` : 'certificate'} & download PDF`}
            </button>
            <p className="cm-note">Certificate numbers and verification codes are assigned when you issue. Issued certificates appear on the verification page straight away.</p>
          </form>

          <div className="cm-preview">
            <div className="cm-card cm-preview-card">
              <div className="cm-preview-head">
                <span>Preview</span>
                <small>{names.length > 1 ? `Showing ${names[0]}; ${names.length - 1} more will follow the same design` : 'The QR code is added when the certificate is issued'}</small>
              </div>
              <ScaledCertificate cert={previewCert} qrDataUrl="" maxHeight={form.design === 'classic' ? 520 : 720} />
            </div>

            {justIssued.length > 0 && (
              <div className="cm-card cm-issued">
                <div className="cm-issued-head">
                  <CheckCircle2 size={20} />
                  <b>{justIssued.length} certificate{justIssued.length > 1 ? 's' : ''} issued</b>
                  <button type="button" className="cm-ghost" onClick={() => downloadCertificatesPdf(justIssued, `certificates-${justIssued[0].certificateNo}.pdf`)}>
                    <Download size={15} /> PDF again
                  </button>
                </div>
                <ul>
                  {justIssued.map((c) => (
                    <li key={c.id}>
                      <span className="n">{c.recipientName}</span>
                      <span className="mono">{c.certificateNo}</span>
                      <a href={`/verify/${c.id}`} target="_blank" rel="noreferrer">Open verification page <ExternalLink size={13} /></a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="cm-card cm-list">
          <div className="cm-toolbar">
            <div className="cm-search">
              <Search size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, certificate no. or code" />
            </div>
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} aria-label="Course">
              <option value="all">All courses</option>
              {Object.values(COURSE_PRESETS).map((c) => <option key={c.key} value={c.key}>{c.title}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status">
              <option value="all">Any status</option>
              <option value="valid">Valid</option>
              <option value="revoked">Revoked</option>
            </select>
            <button className="cm-ghost" onClick={load} disabled={loading}><RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh</button>
          </div>

          {listError && <div className="cm-error">{listError}</div>}
          {!listError && !loading && certs.length === 0 && (
            <div className="cm-empty">
              <Award size={34} />
              <p>No certificates issued yet.</p>
              <button className="cm-primary small" onClick={() => setView('issue')}><Plus size={16} /> Issue the first one</button>
            </div>
          )}
          {!listError && certs.length > 0 && (
            <div className="cm-table-wrap">
              <table className="cm-table">
                <thead>
                  <tr>
                    <th>Graduate</th><th>Course</th><th>Certificate no.</th><th>Issued</th><th>Status</th><th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const revoked = c.status === 'revoked';
                    return (
                      <tr key={c.id} className={revoked ? 'revoked' : ''}>
                        <td>
                          <div className="n">{c.recipientName}</div>
                          <div className="sub mono">{formatVerificationCode(c.id)}</div>
                        </td>
                        <td>
                          <span className={`cm-course ${c.courseKey}`}>{c.courseTitle}</span>
                          <div className="sub">{c.instructorName || '—'}</div>
                        </td>
                        <td className="mono">{c.certificateNo}</td>
                        <td>{formatCertDate(c.issueDate)}</td>
                        <td>
                          <span className={`cm-status ${revoked ? 'bad' : 'ok'}`}>
                            {revoked ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                            {revoked ? 'Revoked' : 'Valid'}
                          </span>
                        </td>
                        <td>
                          <div className="cm-actions">
                            <a className="cm-icon" href={`/verify/${c.id}`} target="_blank" rel="noreferrer" title="Open verification page"><ExternalLink size={16} /></a>
                            <button className="cm-icon" onClick={() => copyLink(c)} title="Copy verification link"><Link2 size={16} /></button>
                            <button className="cm-icon" onClick={() => download(c, 'pdf')} disabled={busyId === c.id} title="Download PDF"><Download size={16} /></button>
                            <button className="cm-icon text" onClick={() => download(c, 'png')} disabled={busyId === c.id} title="Download PNG">PNG</button>
                            <button className={`cm-icon ${revoked ? '' : 'danger'}`} onClick={() => toggleStatus(c)} disabled={busyId === c.id} title={revoked ? 'Reinstate' : 'Revoke'}>
                              {revoked ? <RotateCcw size={16} /> : <ShieldOff size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="cm-none">No certificates match these filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {toast && <div className="cm-toast" role="status">{toast}</div>}
    </div>
  );
};

export default CertificateManagement;
