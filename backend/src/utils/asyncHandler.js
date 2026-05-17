/**
 * asyncHandler
 * Wraps an async controller function and forwards any thrown errors
 * to Express's global error handler via next(err).
 *
 * Usage:
 *   router.post('/route', asyncHandler(async (req, res) => { ... }));
 *
 * @param {Function} fn - Async Express route handler
 * @returns {Function}    Wrapped handler with error forwarding
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
