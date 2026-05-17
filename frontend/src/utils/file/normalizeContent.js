/**
 * normalizeContent
 *
 * Produces a deterministic, format-agnostic string from raw semantic text.
 * This ensures the same document content generates the same hash
 * regardless of scanning quality, compression, or formatting changes.
 *
 * Rules applied:
 *  1. Lowercase all characters
 *  2. Normalize unicode (NFC form)
 *  3. Remove non-printable / control characters
 *  4. Collapse all whitespace (spaces, tabs, newlines) into single spaces
 *  5. Trim leading/trailing whitespace
 *  6. Remove common formatting noise (bullets, dashes at line starts, etc.)
 *
 * @param {string} rawText — the extracted raw semantic text
 * @returns {string}         deterministic normalized string
 */
export const normalizeContent = (rawText = '') => {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // 1. Unicode normalization (NFC — canonical decomposition + composition)
  text = text.normalize('NFC');

  // 2. Lowercase
  text = text.toLowerCase();

  // 3. Remove non-printable / control characters (except normal whitespace)
  text = text.replace(/[^\x20-\x7E\u00A0-\uFFFF\s]/g, '');

  // 4. Remove common formatting noise
  //    - bullet points: •, ●, ○, ◦, ▪, ▸, ►, ‣
  //    - decorative dashes at line starts
  text = text.replace(/[•●○◦▪▸►‣]/g, '');
  text = text.replace(/^\s*[-–—]\s*/gm, '');

  // 5. Collapse all whitespace sequences into a single space
  text = text.replace(/\s+/g, ' ');

  // 6. Trim
  text = text.trim();

  return text;
};
