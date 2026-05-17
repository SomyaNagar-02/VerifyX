/**
 * extractFields
 *
 * Extracts structured semantic fields from OCR/PDF text.
 * Uses regex patterns to identify key document fields.
 * This enables structured field comparison during verification.
 *
 * @param {string} text — raw or OCR-extracted text
 * @returns {Object}      structured fields object
 */

// ─── Field Extraction Patterns ─────────────────────────────────────────────────
// Each pattern: { key, label, patterns: [RegExp] }
// Patterns are tried in order; first match wins.
const FIELD_PATTERNS = [
  {
    key: 'name',
    label: 'Name',
    patterns: [
      /(?:name|awarded\s+to|presented\s+to|certified\s+that|this\s+is\s+to\s+certify\s+that|recipient)\s*[:\-–—]?\s*([A-Z][a-zA-Z\s.'-]{2,50})/i,
      /(?:mr|mrs|ms|dr|shri|smt)\.?\s+([A-Z][a-zA-Z\s.'-]{2,50})/i,
    ],
  },
  {
    key: 'certificateId',
    label: 'Certificate ID',
    patterns: [
      /(?:certificate\s*(?:no|number|id|#)|cert\s*(?:no|id|#)|serial\s*(?:no|number)|doc\s*(?:no|id))\s*[:\-–—#]?\s*([A-Z0-9\-/]{3,30})/i,
      /(?:ref(?:erence)?\s*(?:no|number|id|#))\s*[:\-–—#]?\s*([A-Z0-9\-/]{3,30})/i,
    ],
  },
  {
    key: 'issueDate',
    label: 'Issue Date',
    patterns: [
      /(?:date\s*(?:of\s+issue)?|issued\s+on|dated|valid\s+from|effective\s+date)\s*[:\-–—]?\s*(\d{1,2}[\s/\-.]\w{3,9}[\s/\-.]\d{2,4})/i,
      /(?:date\s*(?:of\s+issue)?|issued\s+on|dated)\s*[:\-–—]?\s*(\d{1,2}[\s/\-.]\d{1,2}[\s/\-.]\d{2,4})/i,
      /(?:date|issued)\s*[:\-–—]?\s*(\w+\s+\d{1,2},?\s+\d{4})/i,
    ],
  },
  {
    key: 'issuer',
    label: 'Issuer',
    patterns: [
      /(?:issued\s+by|issuing\s+authority|authority|organization|institution|university|college)\s*[:\-–—]?\s*([A-Z][A-Za-z\s.,&'()-]{3,80})/i,
      /(?:signed\s+by|authorized\s+by|director|principal|registrar)\s*[:\-–—]?\s*([A-Z][A-Za-z\s.,'-]{3,60})/i,
    ],
  },
  {
    key: 'registrationNumber',
    label: 'Registration Number',
    patterns: [
      /(?:registration\s*(?:no|number|#)|reg(?:ist(?:ration)?)?\s*(?:no|#)|enrollment\s*(?:no|number)|roll\s*(?:no|number))\s*[:\-–—#]?\s*([A-Z0-9\-/]{3,30})/i,
      /(?:student\s*id|employee\s*id|patient\s*id|id\s*(?:no|number))\s*[:\-–—#]?\s*([A-Z0-9\-/]{3,30})/i,
    ],
  },
];

// ─── Main extraction function ──────────────────────────────────────────────────
export const extractFields = (text = '') => {
  const fields = {};

  if (!text || typeof text !== 'string') {
    // Return empty fields
    FIELD_PATTERNS.forEach(({ key }) => {
      fields[key] = null;
    });
    return fields;
  }

  // Try each field pattern set
  FIELD_PATTERNS.forEach(({ key, patterns }) => {
    let matched = null;
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        matched = match[1].trim();
        break;
      }
    }
    fields[key] = matched;
  });

  return fields;
};

/**
 * getFieldCompleteness
 * Returns the number and percentage of fields that were successfully extracted.
 */
export const getFieldCompleteness = (fields) => {
  const keys = Object.keys(fields);
  const total = keys.length;
  const filled = keys.filter((k) => fields[k] !== null && fields[k] !== '').length;
  return {
    filled,
    total,
    percentage: total > 0 ? Math.round((filled / total) * 100) : 0,
  };
};

export { FIELD_PATTERNS };
