const express = require('express');
const { sealDocument, verifyDocument } = require('../controllers/documentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * ─── Document Routes ─────────────────────────────────────────────────────────
 */

// POST /api/documents/seal — Seal a new document hash (Authenticated Issuers only)
router.post('/seal', protect, sealDocument);

// POST /api/documents/verify — Verify a document's hash against its seal (Public)
router.post('/verify', verifyDocument);

module.exports = router;
