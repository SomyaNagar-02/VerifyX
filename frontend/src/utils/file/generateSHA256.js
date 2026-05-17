/**
 * generateSHA256
 *
 * Generates a SHA-256 hash from normalized semantic content
 * using the browser's native Web Crypto API.
 *
 * IMPORTANT:
 *  - This hashes SEMANTIC CONTENT, not raw binary files.
 *  - Runs entirely in the browser — no server round-trip.
 *  - Returns a lowercase hex string.
 *
 * @param {string} normalizedContent — deterministic normalized text
 * @returns {Promise<string>}          64-char lowercase hex hash
 */
export const generateSHA256 = async (normalizedContent = '') => {
  if (!normalizedContent) {
    throw new Error('Cannot hash empty content');
  }

  // Encode the string as UTF-8 bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(normalizedContent);

  // Use Web Crypto API to generate SHA-256 digest
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
};
