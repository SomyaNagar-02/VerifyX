const { body } = require('express-validator');

// ─── Shared patterns ───────────────────────────────────────────────────────────
// Mirrors the frontend validators.js rules exactly — one source of truth.
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX  = /^[a-zA-Z\s'\-.]+$/;

// ─────────────────────────────────────────────────────────────────────────────
// signupValidation
// Chain for: POST /api/auth/signup
// ─────────────────────────────────────────────────────────────────────────────
const signupValidation = [
  // ── Name ────────────────────────────────────────────────────────────────────
  body('name')
    .trim()
    .notEmpty()
      .withMessage('Full name is required')
    .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters')
    .isLength({ max: 80 })
      .withMessage('Name cannot exceed 80 characters')
    .matches(NAME_REGEX)
      .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  // ── Email ────────────────────────────────────────────────────────────────────
  body('email')
    .trim()
    .notEmpty()
      .withMessage('Email is required')
    .isLength({ max: 254 })
      .withMessage('Email address is too long')
    .matches(EMAIL_REGEX)
      .withMessage('Please enter a valid email address (e.g. name@domain.com)')
    .normalizeEmail({ gmail_remove_dots: false }),

  // ── Password (strict — all 4 rules required at signup) ───────────────────────
  body('password')
    .notEmpty()
      .withMessage('Password is required')
    .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
    .isLength({ max: 128 })
      .withMessage('Password is too long (max 128 characters)')
    .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter (A–Z)')
    .matches(/[0-9]/)
      .withMessage('Password must contain at least one number (0–9)')
    .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must contain at least one special character (!@#$…)'),

  // ── Role ─────────────────────────────────────────────────────────────────────
  body('role')
    .optional()
    .isIn(['issuer'])
      .withMessage('Role must be "issuer"'),
];

// ─────────────────────────────────────────────────────────────────────────────
// loginValidation
// Chain for: POST /api/auth/login
// Login validation is intentionally lenient — the controller handles
// wrong credentials with a generic message to prevent user enumeration.
// ─────────────────────────────────────────────────────────────────────────────
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
      .withMessage('Email is required')
    .matches(EMAIL_REGEX)
      .withMessage('Please enter a valid email address')
    .normalizeEmail({ gmail_remove_dots: false }),

  body('password')
    .notEmpty()
      .withMessage('Password is required'),
];

module.exports = { signupValidation, loginValidation };
