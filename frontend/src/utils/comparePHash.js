/**
 * comparePHash
 *
 * Compares two perceptual hashes using Hamming distance.
 * Returns a similarity percentage and a classification.
 *
 * Similarity bands:
 *  90%+    → highly similar   (same document, minor visual differences)
 *  70–89%  → moderately similar (rescan, screenshot, format change)
 *  <70%    → suspicious        (potential tampering or different document)
 *
 * @param {string} hashA — hex pHash string
 * @param {string} hashB — hex pHash string
 * @returns {{ similarity: number, isSimilar: boolean, classification: string }}
 */

// ─── Hamming distance between two hex hash strings ──────────────────────────

const hexToBin = (hex) => {
  return hex
    .split('')
    .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
    .join('');
};

const hammingDistance = (binA, binB) => {
  let distance = 0;
  const len = Math.min(binA.length, binB.length);
  for (let i = 0; i < len; i++) {
    if (binA[i] !== binB[i]) distance++;
  }
  // Account for length difference
  distance += Math.abs(binA.length - binB.length);
  return distance;
};

// ─── Classification thresholds ──────────────────────────────────────────────

const THRESHOLDS = {
  HIGH:     90,  // 90%+ → highly similar
  MODERATE: 70,  // 70–89% → moderately similar
};

const classify = (similarity) => {
  if (similarity >= THRESHOLDS.HIGH) return 'highly_similar';
  if (similarity >= THRESHOLDS.MODERATE) return 'moderately_similar';
  return 'suspicious';
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const comparePHash = (hashA, hashB) => {
  if (!hashA || !hashB) {
    return { similarity: 0, isSimilar: false, classification: 'unknown' };
  }

  // Normalize to lowercase
  const a = hashA.toLowerCase();
  const b = hashB.toLowerCase();

  // If hashes are identical
  if (a === b) {
    return { similarity: 100, isSimilar: true, classification: 'highly_similar' };
  }

  // Convert hex → binary and compute Hamming distance
  const binA = hexToBin(a);
  const binB = hexToBin(b);

  const totalBits = Math.max(binA.length, binB.length);
  if (totalBits === 0) {
    return { similarity: 0, isSimilar: false, classification: 'unknown' };
  }

  const distance = hammingDistance(binA, binB);
  const similarity = Math.round(((totalBits - distance) / totalBits) * 100);

  return {
    similarity,
    isSimilar: similarity >= THRESHOLDS.MODERATE,
    classification: classify(similarity),
  };
};

export { THRESHOLDS };
