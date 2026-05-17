# 🏆 DocuTrust Project Progress & Status Ledger

**Current Date: May 17, 2026**  
*DocuTrust is a privacy-first, zero-storage semantic document verification platform built to verify files without permanently saving them to a server.*

This document provides a highly detailed status ledger of every feature, component, utility, backend schema, and logic flow completed up to this date to serve as a perfect transition index for future developers or AI agents.

---

## 🛑 IMPORTANT: DEVELOPMENT & TESTING STATUS
> [!IMPORTANT]
> The primary Dashboard (`/dashboard`) is currently configured as a **Testing Dashboard**.
> - **Simulated / Bypass Sealing**: Standard random `sealId` generation has been temporarily removed from the backend (`sealDocument` saves `sealId` as an empty string `""`).
> - **Fallback Query Verification**: The backend `verifyDocument` query automatically falls back to **searching and matching by `documentHash` directly** when no Seal ID is supplied. This allows complete end-to-end sealing and verification simulation during development!

---

## 🟢 MILESTONES COMPLETED (TILL DATE)

### 🔑 1. Backend Foundation & JWT Authentication
- **Local MongoDB Connection**: Setup database initialization scripts using Mongoose.
- **User Schema (`User.js`)**: Implemented email, username, bcrypt-hashed passwords, role management (`"Issuer"`, `"Verifier"`), and optional organization labels.
- **Session Authentication**:
  - Implemented JWT token signups and logins with auto-expires.
  - Implemented a custom JWT parsing and access protection middleware (`authMiddleware.js`).
  - Set up strict rate-limiters (`express-rate-limit`) restricting high-frequency signup or login brute-force attempts.

### 📄 2. Browser-Side Document Processing System (Core Intelligence)
Developed a multi-stage frontend processing pipeline to analyze, parse, and verify documents entirely inside the client sandbox:
- **`FileUpload.jsx`**: Responsive drag-and-drop landing area supporting PDF, JPEG, JPG, and PNG uploads with size capping ($25\text{MB}$) and type filters.
- **`extractPdfContent.js`**: Uses `pdfjs-dist` to isolate and parse the readable text layer of digital PDFs, bypassing formatting noise and raw binary bytes.
- **`normalizeContent.js`**: Standardizes text deterministically (lowercase conversion, unicode `NFC` normalization, double space collapsing, bullet point/dash removal) to ensure identical content yields identical hashes regardless of formatting shifts.
- **`generateSHA256.js`**: Generates high-strength SHA-256 hashes inside the browser using the native **Web Crypto API**, avoiding server round-trips.
- **`runOCR.js`**: Runs character recognition inside the browser using `Tesseract.js` for images and scanned PDF fallbacks.
- **`extractFields.js`**: Scans raw OCR output against deep regex structures to pull out semantic document details (`Name`, `Certificate ID`, `Issue Date`, `Issuer`, `Registration Number`).

### 🎨 3. Interactive UI & HTML5 Date Picker Upgrades
- **Dashboard Renaming**: Formally transitioned the primary panel to a customized **Testing Dashboard** containing neon green notifications and card modules.
- **Interactive Correction Panels**: Refactored both `ExtractedFields.jsx` (for digital documents) and `OCRPreview.jsx` (for scanned images) so issuers can manually fill or correct parsed details.
- **Native Date Inputs**: Converted the `Issue Date` text field to a native HTML5 `<input type="date">` in both components.
- **OCR Date String Normalization**: Built custom date-normalizers (`normalizeToInputDate`) to dynamically translate standard text extractions (e.g. `17/05/2026` or `May 17, 2026`) into the strict `YYYY-MM-DD` format required by browser calendars.
- **Dark Mode Styling**: Applied specific SVG CSS inversion filters (`filter: invert(1)`) on default browser date picker icons, preserving the dark, glassmorphic UI.

### 💾 4. Database Schema & Verification Controller Upgrades
- **Document Model (`Document.js`)**: Configured the collection schema to store:
  - `documentHash` & `hashAlgorithm` (`"SHA-256"` or `"pHash"`)
  - `ocrText` (saves raw character string)
  - `fields` (nested Mongoose sub-schema containing name, certificateId, issueDate, issuer, and registrationNumber)
  - Standard transaction metadata (`issuedTo`, `issuedBy`, `documentType`, `verificationCount`).
- **Hamming Distance Matcher**: Configured perceptual hashing (`pHash`) checks inside the backend using bit-wise Hamming distance calculations, establishing an $85\%$ visual similarity threshold to tolerate compressed photos or rescans.

---

## 🛠️ COMPLETED SYSTEM DATA FLOWS

### 1. Digital Document Pipeline (Vite React)
```text
Upload PDF 
   ↓
Extract Semantic Readable Text (pdfjs-dist)
   ↓
Normalize Text Structure (normalizeContent.js)
   ↓
Generate Browser SHA-256 Hash (generateSHA256.js)
   ↓
Run Supplementary Scanned OCR (Tesseract.js)
   ↓
Match Key Details & Standardize Dates to YYYY-MM-DD
   ↓
Confirm & Save Proofs, OCR Text, and Fields to MongoDB
```

### 2. Photo Image / Scan Pipeline (Vite React)
```text
Upload PNG/JPG
   ↓
Image Canvas Contrast Preprocessing
   ↓
Compute 64-bit Perceptual Hash (generatePHash.js)
   ↓
Run Scanned Character Recognition (runOCR.js)
   ↓
Match Details & Auto-Format Issue Date Picker
   ↓
Save pHash, OCR Text, and Structured Fields to MongoDB

