const express = require('express');
const { getDashboardStats, getSystemActivityLogs } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * ─── Admin & System Management Routes ─────────────────────────────────────────
 */

// GET /api/admin/stats — Retrieve real-time dashboard statistics (Authenticated Issuers)
router.get('/stats', protect, getDashboardStats);

// GET /api/admin/logs — Retrieve timestamped audit logging history (Authenticated Issuers)
router.get('/logs', protect, getSystemActivityLogs);

module.exports = router;
