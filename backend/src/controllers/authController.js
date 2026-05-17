const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const AuditLog = require('../models/AuditLog');

// ─── Helper: log auth events ───────────────────────────────────────────────────
const logAuthEvent = async ({ action, userId, result, req }) => {
  try {
    await AuditLog.create({
      action,
      userId: userId || null,
      result,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
  } catch {
    // Non-critical — don't fail the request if audit logging fails
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/signup
// @desc    Register a new issuer account
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if email is already registered
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // Create user — password hashing is handled by the pre-save hook in User model
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'issuer',
  });

  // Audit: successful registration
  await logAuthEvent({ action: 'ISSUE', userId: user._id, result: 'SUCCESS', req });

  res.status(201).json({
    success: true,
    message: 'Account created successfully. Please log in.',
    user: user.toPublicJSON(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Authenticate user and return JWT
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fetch user with password field (select: false on schema means we must be explicit)
  const user = await User.findOne({ email }).select('+password');

  // Use a generic error message to prevent user enumeration attacks
  if (!user) {
    await logAuthEvent({ action: 'VERIFY', result: 'FAILED', req });
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
  }

  // Verify password using bcrypt comparison
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await logAuthEvent({ action: 'VERIFY', userId: user._id, result: 'FAILED', req });
    throw new ApiError(401, 'Invalid email or password');
  }

  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate JWT
  const token = generateToken({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Audit: successful login
  await logAuthEvent({ action: 'VERIFY', userId: user._id, result: 'SUCCESS', req });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: user.toPublicJSON(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get currently authenticated user's profile
// @access  Protected (requires JWT via protect middleware)
// ─────────────────────────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  // req.user is already attached by the protect middleware
  res.status(200).json({
    success: true,
    user: req.user.toPublicJSON(),
  });
});

module.exports = { signup, login, getMe };
