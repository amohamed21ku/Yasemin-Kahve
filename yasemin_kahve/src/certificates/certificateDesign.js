// certificateDesign.js - shared constants and helpers for Yasemin Kahve Academy certificates

// Public address the QR code points to. Override with VITE_SITE_URL if the domain changes.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://yaseminkahve.com').replace(/\/$/, '');

const A = '/static/certificates';
export const ASSETS = {
  logo: `${A}/academy-logo.png`,
  corner: `${A}/corner.svg`,
  seal: { green: `${A}/seal-green.png`, sensory: `${A}/seal-sensory.png` },
  courseIcon: { green: `${A}/sca-green-coffee.png`, sensory: `${A}/sca-sensory-skills.png` },
};

// Course presets. `key` picks the icon, seal and colours; title and description stay editable.
export const COURSE_PRESETS = {
  green: {
    key: 'green',
    title: 'Green Coffee Analysis',
    prefix: 'GCA',
    description:
      'Covering green coffee grading and classification, defect identification, moisture and density measurement, and screen size analysis.',
  },
  sensory: {
    key: 'sensory',
    title: 'Sensory Skills',
    prefix: 'SS',
    description:
      'Covering taste and aroma recognition, intensity and triangulation tests, and the fundamentals of professional coffee cupping.',
  },
};

export const COURSE_COLORS = {
  green: { band: '#A9D9C7', deep: '#3E9C7E' },
  sensory: { band: '#EFD26A', deep: '#A6772A' },
};

export const DESIGNS = {
  modern: { label: 'Modern · portrait', width: 794, height: 1123, orientation: 'portrait' },
  classic: { label: 'Classic · landscape', width: 1123, height: 794, orientation: 'landscape' },
};

export const DEFAULT_VERIFIED_LINE = 'Verified by SCA Campus';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// "2026-11-17" -> "17 November 2026"
export const formatCertDate = (value) => {
  if (!value) return '';
  const [y, m, d] = String(value).split('-').map(Number);
  if (!y || !m || !d) return String(value);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

export const todayISO = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

// Verification codes: 10 characters, no look-alike letters (0/O, 1/I/L).
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const generateVerificationCode = (length = 10) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
};

// "K7QXM2PA9D" -> "K7QX-M2PA-9D" for reading aloud or typing
export const formatVerificationCode = (code = '') =>
  code.replace(/[^A-Z0-9]/gi, '').toUpperCase().match(/.{1,4}/g)?.join('-') || '';

export const normalizeVerificationCode = (input = '') => {
  const raw = String(input).trim();
  // Accept a pasted link as well as a bare code
  const fromUrl = raw.match(/verify\/([A-Za-z0-9-]+)/);
  return (fromUrl ? fromUrl[1] : raw).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
};

export const verificationUrl = (code) => `${SITE_URL}/verify/${code}`;

export const safeFileName = (text) =>
  (text || 'certificate')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/[^\w\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-') || 'certificate';
