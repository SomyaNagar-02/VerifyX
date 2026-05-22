/**
 * Determines the final RED/YELLOW/GREEN state of the verification.
 */
const determineVerificationState = ({
  isExactHashMatch,
  overallConfidence,
  ocrSimilarity
}) => {
  let result = 'RED';
  let message = 'Document verification failed. Significant discrepancies found.';

  if (isExactHashMatch) {
    result = 'GREEN';
    message = 'Document verified successfully. Cryptographic hash match confirmed.';
    return { result, message };
  }

  if (overallConfidence >= 85) {
    result = 'GREEN';
    message = 'Document verified successfully via high semantic correlation.';
  } else if (overallConfidence >= 65 || ocrSimilarity >= 70) {
    result = 'YELLOW';
    message = 'Document partially verified. Minor discrepancies or layout changes detected.';
  }

  return { result, message };
};

module.exports = {
  determineVerificationState
};
