// ─── Shared Validation Rules ───────────────────────────────────────────────────
// Single source of truth — mirrors backend express-validator constraints exactly.
// Used by both Login.jsx and Signup.jsx.

// ─── Email ─────────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/**
 * validateEmail
 * Returns an error string, or empty string if valid.
 */
export const validateEmail = (value = '') => {
  const v = value.trim();
  if (!v) return 'Email is required';
  if (!EMAIL_REGEX.test(v)) return 'Enter a valid email address (e.g. name@domain.com)';
  if (v.length > 254) return 'Email address is too long';
  return '';
};

// ─── Password ──────────────────────────────────────────────────────────────────

/**
 * PASSWORD_RULES
 * Each rule has: id, label (shown in the UI checklist), test function.
 * Used by the requirement checklist in Signup and the strength indicator.
 */
export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (v) => v.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter (A–Z)',
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: 'digit',
    label: 'One number (0–9)',
    test: (v) => /[0-9]/.test(v),
  },
  {
    id: 'special',
    label: 'One special character (!@#$…)',
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

/**
 * getPasswordStrength
 * Returns { score 0-4, label, color } based on how many PASSWORD_RULES pass.
 */
export const getPasswordStrength = (password = '') => {
  if (!password) return { score: 0, label: '', color: '' };
  const score = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const map = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Weak', color: 'red.400' },
    { score: 2, label: 'Fair', color: 'orange.400' },
    { score: 3, label: 'Good', color: 'yellow.400' },
    { score: 4, label: 'Strong', color: 'green.400' },
  ];
  return map[score];
};

/**
 * validatePassword — for Signup (strict: all 4 rules must pass)
 * Returns an error string, or empty string if valid.
 */
export const validatePasswordStrict = (value = '') => {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
  if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain at least one special character';
  if (value.length > 128) return 'Password is too long (max 128 characters)';
  return '';
};

/**
 * validatePasswordBasic — for Login (lenient: just checks not empty)
 * Login should not tell attackers what the password policy is.
 */
export const validatePasswordBasic = (value = '') => {
  if (!value) return 'Password is required';
  return '';
};

// ─── Name ──────────────────────────────────────────────────────────────────────
export const validateName = (value = '') => {
  const v = value.trim();
  if (!v) return 'Full name is required';
  if (v.length < 2) return 'Name must be at least 2 characters';
  if (v.length > 80) return 'Name is too long (max 80 characters)';
  if (!/^[a-zA-Z\s'\-\.]+$/.test(v)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  return '';
};

// ─── Run all Signup validations ────────────────────────────────────────────────
export const validateSignupForm = ({ name, email, password }) => {
  const errors = {};
  const nameErr = validateName(name);
  if (nameErr) errors.name = nameErr;
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;
  const passErr = validatePasswordStrict(password);
  if (passErr) errors.password = passErr;
  return errors;
};

// ─── Run all Login validations ─────────────────────────────────────────────────
export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;
  const passErr = validatePasswordBasic(password);
  if (passErr) errors.password = passErr;
  return errors;
};

/**
 * mapApiErrors
 * Takes the `errors` array returned by the backend (field-level errors)
 * and maps them into { field: message } object for state.
 *
 * @param {Array} apiErrors  - e.g. [{ field: 'email', message: '...' }]
 * @returns {Object}           { email: '...', password: '...' }
 */
export const mapApiErrors = (apiErrors = []) => {
  return apiErrors.reduce((acc, { field, message }) => {
    acc[field] = message;
    return acc;
  }, {});
};
