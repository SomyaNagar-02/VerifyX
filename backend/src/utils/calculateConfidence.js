/**
 * Calculates overall confidence score based on various weighted signals.
 */
const calculateConfidence = ({
  hashSimilarity = 0,
  ocrSimilarity = 0,
  pHashSimilarity = 0,
  isExactHashMatch = false
}) => {
  if (isExactHashMatch) {
    return { overallConfidence: 100 };
  }

  // Weight distributions
  const WEIGHTS = {
    hash: 0.60,      // Semantic Hash / pHash (Highest)
    ocr: 0.40        // OCR Similarity (Medium)
  };

  // Determine the primary hash score to use
  const primaryHashScore = Math.max(hashSimilarity, pHashSimilarity);

  const overallConfidence = Math.round(
    (primaryHashScore * WEIGHTS.hash) +
    (ocrSimilarity * WEIGHTS.ocr)
  );

  return { overallConfidence };
};

module.exports = {
  calculateConfidence
};
