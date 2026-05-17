const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * protect
 *
 * JWT authentication middleware.
 * Extracts the Bearer token from the Authorization header,
 * verifies it, and attaches the authenticated user to req.user.
 *
 * Throws 401 if:
 *  - No token provided
 *  - Token is invalid or expired
 *  - User no longer exists in DB
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  // Verify signature and expiry
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Session expired — please log in again');
    }
    throw new ApiError(401, 'Not authorized — invalid token');
  }

  // Confirm user still exists in DB (handles account deletion mid-session)
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new ApiError(401, 'Not authorized — user no longer exists');
  }

  req.user = user;
  next();
});

/**
 * authorize(...roles)
 *
 * Role-based access control middleware.
 * Must be used after protect().
 *
 * Usage:
 *   router.delete('/admin', protect, authorize('admin'), handler);
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(
      403,
      `Forbidden — role '${req.user.role}' is not allowed to access this resource`
    );
  }
  next();
};

module.exports = { protect, authorize };
