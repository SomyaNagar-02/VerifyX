const { normalizeText } = require('./normalizeText');

const CRITICAL_FIELDS = ['name', 'certificate ID', 'registration number'];

/**
 * Compares structured fields from stored document against uploaded payload.
 */
const compareFields = (storedFields, uploadedFields) => {
  if (!storedFields || !uploadedFields) {
    return {
      matchedFields: [],
      mismatchedFields: [],
      criticalMismatch: false,
      fieldSimilarity: 0
    };
  }

  const sf = typeof storedFields === 'string' ? JSON.parse(storedFields) : storedFields;
  const uf = typeof uploadedFields === 'string' ? JSON.parse(uploadedFields) : uploadedFields;

  const matchedFields = [];
  const mismatchedFields = [];
  let criticalMismatch = false;

  const keys = Object.keys(sf);
  if (keys.length === 0) {
    return { matchedFields, mismatchedFields, criticalMismatch: false, fieldSimilarity: 100 };
  }

  let validKeysCount = 0;

  keys.forEach(key => {
    const val1 = normalizeText(sf[key]) || '';
    const val2 = normalizeText(uf[key]) || '';

    // If a field is empty in both the stored and uploaded document, 
    // it simply wasn't found in either. We skip it so it doesn't skew the score.
    if (val1 === '' && val2 === '') {
      return;
    }

    validKeysCount++;

    if (val1 === val2) {
      matchedFields.push(key);
    } else {
      mismatchedFields.push(key);
      if (CRITICAL_FIELDS.includes(key.toLowerCase())) {
        criticalMismatch = true;
      }
    }
  });

  const fieldSimilarity = validKeysCount > 0 ? Math.round((matchedFields.length / validKeysCount) * 100) : 100;

  return {
    matchedFields,
    mismatchedFields,
    criticalMismatch,
    fieldSimilarity
  };
};

module.exports = {
  compareFields
};
