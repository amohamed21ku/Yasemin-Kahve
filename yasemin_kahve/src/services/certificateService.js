// certificateService.js - Firestore storage for issued academy certificates
//
// certificates/{verificationCode}   one document per certificate, read publicly by its code (QR link)
// certificateCounters/{PREFIX-YEAR} running number used for certificate numbers, admin only
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { COURSE_PRESETS, generateVerificationCode } from '../certificates/certificateDesign';

const CERTS = 'certificates';
const COUNTERS = 'certificateCounters';

const coursePrefix = (courseKey) => COURSE_PRESETS[courseKey]?.prefix || 'GEN';

/**
 * Issues one certificate: reserves the next certificate number and a unique verification code
 * in a single transaction, so two admins issuing at the same time never get the same number.
 */
export const issueCertificate = async (data, issuer) => {
  const year = (data.issueDate || '').slice(0, 4) || String(new Date().getFullYear());
  const prefix = coursePrefix(data.courseKey);
  const counterRef = doc(db, COUNTERS, `${prefix}-${year}`);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateVerificationCode();
    const certRef = doc(db, CERTS, code);
    try {
      const result = await runTransaction(db, async (tx) => {
        const [counterSnap, existing] = await Promise.all([tx.get(counterRef), tx.get(certRef)]);
        if (existing.exists()) throw new Error('code-collision');
        const next = (counterSnap.exists() ? counterSnap.data().count || 0 : 0) + 1;
        const certificateNo = `YKA-${prefix}-${year}-${String(next).padStart(4, '0')}`;
        const record = {
          verificationCode: code,
          certificateNo,
          recipientName: data.recipientName.trim(),
          courseKey: data.courseKey,
          courseTitle: data.courseTitle.trim(),
          description: (data.description || '').trim(),
          instructorName: (data.instructorName || '').trim(),
          issueDate: data.issueDate,
          design: data.design || 'modern',
          verifiedLine: (data.verifiedLine || '').trim(),
          status: 'valid',
          issuedBy: issuer?.uid || null,
          issuedByName: issuer?.name || issuer?.email || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        tx.set(counterRef, { count: next, updatedAt: serverTimestamp() }, { merge: true });
        tx.set(certRef, record);
        return record;
      });
      return { id: code, ...result, createdAt: new Date() };
    } catch (err) {
      if (err?.message === 'code-collision') continue;
      throw err;
    }
  }
  throw new Error('Could not reserve a unique verification code. Please try again.');
};

export const getCertificate = async (code) => {
  if (!code) return null;
  const snap = await getDoc(doc(db, CERTS, code));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const listCertificates = async () => {
  const snap = await getDocs(query(collection(db, CERTS), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const setCertificateStatus = async (code, status, { reason = '', user } = {}) => {
  const patch = {
    status,
    updatedAt: serverTimestamp(),
    revokedReason: status === 'revoked' ? reason : '',
    revokedAt: status === 'revoked' ? serverTimestamp() : null,
    revokedBy: status === 'revoked' ? user?.uid || null : null,
  };
  await updateDoc(doc(db, CERTS, code), patch);
  return patch;
};
