const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * validate
 *
 * Middleware factory that runs after express-validator chains.
 * Collects all field errors and throws a 400 ApiError with a
 * structured list so the frontend can map them field-by-field.
 *
 * Usage:
 *   router.post('/signup', signupValidationRules, validate, signupController)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    // Put the first error's message as the top-level message,
    // and include all errors in an `errors` array for granularity.
    const firstMsg = formatted[0].message;
    const err = new ApiError(400, firstMsg);
    err.errors = formatted;
    return next(err);
  }
  next();
};

module.exports = validate;
