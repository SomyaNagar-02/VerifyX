/**
 * errorHandler
 *
 * Global Express error-handling middleware.
 * Must be registered LAST in server.js (after all routes).
 *
 * Handles:
 *  - ApiError (operational errors — known, user-facing)
 *  - Mongoose CastError (bad ObjectId)
 *  - Mongoose duplicate key error (code 11000)
 *  - Mongoose ValidationError (schema constraints)
 *  - JWT errors (expired, invalid)
 *  - All other errors → 500
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null; // field-level errors from validate middleware

  // ── Mongoose: Bad ObjectId ─────────────────────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose: Duplicate key (e.g., unique email) ───────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `An account with this ${field} already exists`;
  }

  // ── Mongoose: Schema validation error ─────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const fieldErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = fieldErrors[0].message;
    errors = fieldErrors;
  }

  // ── JWT: Expired token ─────────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired — please log in again';
  }

  // ── JWT: Invalid token ─────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // ── Log non-operational errors in development ──────────────────────────────
  if (process.env.NODE_ENV === 'development' && !err.isOperational) {
    console.error('[ERROR]', err);
  }

  const response = { success: false, message };
  if (errors) response.errors = errors;
  if (process.env.NODE_ENV === 'development') response.stack = err.stack;

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
