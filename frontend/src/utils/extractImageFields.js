/**
 * extractImageFields
 *
 * Extracts structured semantic fields from OCR text obtained from images.
 * Re-uses the core field extraction patterns from extractFields.js and adds
 * image-specific heuristics.
 *
 * Fields extracted:
 *  - Name
 *  - Certificate ID
 *  - Issue Date
 *  - Issuer
 *  - Registration Number
 *
 * @param {string} ocrText — raw OCR-extracted text from the image
 * @returns {{ fields: Object, completeness: Object }}
 */
import { extractFields, getFieldCompleteness } from './file/extractFields';

// ─── Image-specific text cleanup ─────────────────────────────────────────────

/**
 * Clean up common OCR artifacts that appear in image-sourced text.
 * These are less common in PDF-extracted text.
 */
const cleanOCRText = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    // Replace common OCR misreads
    .replace(/[|]/g, 'l')          // pipe → lowercase L
    .replace(/0(?=[a-zA-Z])/g, 'O') // zero before letters → O
    // Remove excessive whitespace while preserving line breaks
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const extractImageFields = (ocrText = '') => {
  // Clean up OCR artifacts
  const cleanedText = cleanOCRText(ocrText);

  // Use shared field extraction patterns
  const fields = extractFields(cleanedText);
  const completeness = getFieldCompleteness(fields);

  return {
    fields,
    completeness,
  };
};

/**
 * Compare fields from two OCR extractions.
 * Returns per-field match info and an overall field match percentage.
 *
 * @param {Object} fieldsA — fields from original document
 * @param {Object} fieldsB — fields from uploaded image
 * @returns {{ matches: Object, matchPercentage: number }}
 */
export const compareExtractedFields = (fieldsA = {}, fieldsB = {}) => {
  const fieldKeys = ['name', 'certificateId', 'issueDate', 'issuer', 'registrationNumber'];
  const matches = {};
  let matched = 0;
  let compared = 0;

  for (const key of fieldKeys) {
    const a = (fieldsA[key] || '').toLowerCase().trim();
    const b = (fieldsB[key] || '').toLowerCase().trim();

    // Skip comparison if both are empty
    if (!a && !b) {
      matches[key] = { status: 'both_empty', match: true };
      continue;
    }

    compared++;

    if (!a || !b) {
      matches[key] = { status: 'one_missing', match: false, a: fieldsA[key], b: fieldsB[key] };
      continue;
    }

    // Fuzzy match: check if one contains the other (handles OCR truncation)
    const isMatch = a === b || a.includes(b) || b.includes(a);
    if (isMatch) matched++;

    matches[key] = {
      status: isMatch ? 'matched' : 'mismatch',
      match: isMatch,
      a: fieldsA[key],
      b: fieldsB[key],
    };
  }

  return {
    matches,
    matchPercentage: compared > 0 ? Math.round((matched / compared) * 100) : 100,
  };
};
