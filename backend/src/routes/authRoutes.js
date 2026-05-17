const express = require('express');
const rateLimit = require('express-rate-limit');

const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { signupValidation, loginValidation } = require('../middlewares/authValidation');
const validate = require('../middlewares/validate');

const router = express.Router();

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// Strict limiter for login: 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
});

// Relaxed limiter for signup: 5 accounts per hour per IP
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: 'Too many signup attempts from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/auth/signup
router.post(
  '/signup',
  signupLimiter,
  signupValidation,
  validate,
  signup
);

// POST /api/auth/login
router.post(
  '/login',
  loginLimiter,
  loginValidation,
  validate,
  login
);

// GET /api/auth/me  (protected)
router.get(
  '/me',
  protect,
  getMe
);

module.exports = router;
