/**
 * ApiError — Custom operational error class.
 *
 * Extends the native Error to carry an HTTP status code.
 * Thrown inside controllers and caught by the global error handler.
 *
 * Usage:
 *   throw new ApiError(401, 'Invalid credentials');
 *   throw new ApiError(404, 'User not found');
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
