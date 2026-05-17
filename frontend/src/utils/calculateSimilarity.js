/**
 * calculateSimilarity
 *
 * Calculates multi-dimensional similarity between an original document
 * and an uploaded image. Combines:
 *  - OCR text similarity   (Sørensen–Dice coefficient on word bigrams)
 *  - Field-level similarity (structured field comparison)
 *  - Visual similarity     (pHash Hamming distance)
 *
 * Produces an overall confidence score as a weighted average.
 *
 * @param {Object} params
 * @param {string} params.ocrTextA    — OCR text from original
 * @param {string} params.ocrTextB    — OCR text from uploaded image
 * @param {Object} params.fieldsA     — extracted fields from original
 * @param {Object} params.fieldsB     — extracted fields from uploaded image
 * @param {number} params.pHashSimilarity — visual similarity (0-100)
 * @returns {{ ocrSimilarity: number, fieldSimilarity: number, visualSimilarity: number, overallConfidence: number }}
 */
import { comparePHash } from './comparePHash';
import { compareExtractedFields } from './extractImageFields';

// ─── Weights for overall confidence ─────────────────────────────────────────

const WEIGHTS = {
  ocr:    0.30,  // 30% weight for raw OCR text
  fields: 0.40,  // 40% weight for structured fields (most reliable)
  visual: 0.30,  // 30% weight for visual (pHash)
};

// ─── Text similarity using Sørensen–Dice coefficient ────────────────────────

const getBigrams = (text) => {
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  const bigrams = new Set();
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
};

const diceCoefficient = (textA, textB) => {
  if (!textA || !textB) return 0;

  const bigramsA = getBigrams(textA);
  const bigramsB = getBigrams(textB);

  if (bigramsA.size === 0 && bigramsB.size === 0) return 100;
  if (bigramsA.size === 0 || bigramsB.size === 0) return 0;

  let intersection = 0;
  for (const bigram of bigramsA) {
    if (bigramsB.has(bigram)) intersection++;
  }

  return Math.round((2 * intersection) / (bigramsA.size + bigramsB.size) * 100);
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const calculateSimilarity = ({
  ocrTextA = '',
  ocrTextB = '',
  fieldsA = {},
  fieldsB = {},
  pHashSimilarity = 0,
} = {}) => {
  // 1. OCR text similarity (Dice coefficient on bigrams)
  const ocrSimilarity = diceCoefficient(ocrTextA, ocrTextB);

  // 2. Field-level similarity
  const { matchPercentage: fieldSimilarity } = compareExtractedFields(fieldsA, fieldsB);

  // 3. Visual similarity (passed in from pHash comparison)
  const visualSimilarity = Math.max(0, Math.min(100, pHashSimilarity));

  // 4. Weighted overall confidence
  const overallConfidence = Math.round(
    WEIGHTS.ocr * ocrSimilarity +
    WEIGHTS.fields * fieldSimilarity +
    WEIGHTS.visual * visualSimilarity,
  );

  return {
    ocrSimilarity,
    fieldSimilarity,
    visualSimilarity,
    overallConfidence,
  };
};

/**
 * Calculate similarity when comparing against a stored pHash (no second OCR text).
 * Used when only a pHash is stored and the uploaded image is freshly processed.
 *
 * @param {Object} params
 * @param {string} params.storedPHash    — hex pHash from the sealed document
 * @param {string} params.uploadedPHash  — hex pHash from the uploaded image
 * @param {Object} params.storedFields   — fields from the sealed document
 * @param {Object} params.uploadedFields — fields from the uploaded image
 * @param {string} params.storedOCR      — OCR text from the sealed document
 * @param {string} params.uploadedOCR    — OCR text from the uploaded image
 * @returns {{ ocrSimilarity: number, fieldSimilarity: number, visualSimilarity: number, overallConfidence: number }}
 */
export const calculateVerificationSimilarity = ({
  storedPHash = '',
  uploadedPHash = '',
  storedFields = {},
  uploadedFields = {},
  storedOCR = '',
  uploadedOCR = '',
} = {}) => {
  const { similarity: pHashSimilarity } = comparePHash(storedPHash, uploadedPHash);

  return calculateSimilarity({
    ocrTextA: storedOCR,
    ocrTextB: uploadedOCR,
    fieldsA: storedFields,
    fieldsB: uploadedFields,
    pHashSimilarity,
  });
};
