# Academy certificates

Certificates are issued from the admin panel and verified publicly on the website.

- **Admin → Certificates → Issue certificates**: choose the course (Green Coffee Analysis or Sensory Skills), the design, type one or more graduate names (one per line), and press **Issue**. Each certificate gets the next certificate number (`YKA-GCA-2026-0001`, `YKA-SS-2026-0001`, …) and a random 10-character verification code, and a print-ready A4 PDF downloads straight away.
- **Admin → Certificates → Issued certificates**: every certificate ever issued, with search, filters, PDF/PNG download, copy link, and **Revoke / Reinstate**.
- **Public page `/verify/<code>`**: the QR code on each certificate opens this page. It shows "Verified certificate" with the holder, course, date, number and the certificate itself, or "Certificate revoked", or "No certificate found". `/verify` on its own lets anyone type the code printed under the QR.

The QR codes always point to `https://yaseminkahve.com/verify/<code>`. To use a different domain, set `VITE_SITE_URL` in the build environment.

## Files

| File | What it does |
| --- | --- |
| `src/certificates/Certificate.jsx`, `Certificate.css` | The certificate design (modern portrait and classic landscape) |
| `src/certificates/certificateDesign.js` | Course presets, colours, asset paths, codes, dates |
| `src/certificates/certificateExport.js` | QR codes and PDF/PNG export |
| `src/certificates/ScaledCertificate.jsx` | On-screen preview |
| `src/services/certificateService.js` | Firestore reads and writes |
| `src/Pages/Admin/components/CertificateManagement.jsx` | Admin tab |
| `src/Pages/CertificateVerify/CertificateVerify.jsx` | Public verification page |
| `public/static/certificates/` | Logo, seals, SCA course icons, corner ornament |

## Firestore data

- `certificates/{verificationCode}`: one document per certificate (`recipientName`, `courseKey`, `courseTitle`, `certificateNo`, `issueDate`, `instructorName`, `design`, `verifiedLine`, `status` = `valid` | `revoked`, `revokedReason`, `issuedBy`, `createdAt`, …). No email or phone number is stored, because the document is public to anyone who has its code.
- `certificateCounters/{PREFIX-YEAR}`: `{ count }`, the running number behind certificate numbers.

## Firestore security rules (required)

Add these blocks inside `match /databases/{database}/documents { … }` in **Firebase console → Firestore Database → Rules**, next to your existing rules, then **Publish**. Without them, issuing fails with "Missing or insufficient permissions" and the verification page cannot read certificates.

```
function isAdmin() {
  return request.auth != null
    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}

// Anyone holding a code can read that one certificate; only admins can list, issue or revoke.
match /certificates/{code} {
  allow get: if true;
  allow list, create, update: if isAdmin();
  allow delete: if false;
}

match /certificateCounters/{counter} {
  allow read, write: if isAdmin();
}
```

If a `function isAdmin()` already exists in your rules, keep one copy only.

Admin access depends on `users/{uid}.isAdmin`. Make sure your `users` rules do not let people set `isAdmin` on their own document, or anyone could make themselves an admin and issue certificates.
