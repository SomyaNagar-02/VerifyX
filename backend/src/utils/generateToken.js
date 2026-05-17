const jwt = require('jsonwebtoken');

/**
 * generateToken
 * Signs a JWT with the user's id and role.
 *
 * @param {Object} payload  - Data to embed in the token (e.g. { id, role })
 * @returns {string}          Signed JWT string
 */
const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;
