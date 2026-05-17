/**
 * processingService
 *
 * Prepares the processed document payload for backend submission.
 * Strips browser-only data (normalized content is large),
 * keeps only what the server needs for seal creation/verification.
 */
import API from './api';

/**
 * prepareSealPayload
 * Transforms the document processing result into the shape the backend expects.
 *
 * @param {Object} processingResult — output from documentProcessor
 * @param {Object} meta             — additional metadata (issuedTo, documentType, etc.)
 * @returns {Object}                  backend-ready payload
 */
export const prepareSealPayload = (processingResult, meta = {}) => {
  if (!processingResult) throw new Error('No processing result to prepare');

  return {
    documentHash: processingResult.documentHash,
    hashAlgorithm: processingResult.hashAlgorithm,
    ocrText: processingResult.ocrText || '',
    fields: processingResult.fields || {},
    fileType: processingResult.fileType,
    // Metadata supplied by the user at submission time
    issuedTo: meta.issuedTo || processingResult.fields?.name || '',
    documentType: meta.documentType || 'Other',
  };
};

/**
 * submitSeal
 * Sends the processed payload to the backend to create a Seal ID.
 *
 * @param {Object} payload — from prepareSealPayload
 * @returns {Promise<Object>}  backend response with sealId
 */
export const submitSeal = async (payload) => {
  const response = await API.post('/documents/seal', payload);
  return response.data;
};

/**
 * submitVerification
 * Sends a hash + fields payload to the backend for verification against an existing seal.
 *
 * @param {Object} payload — from prepareSealPayload
 * @param {string} sealId  — the Seal ID to verify against
 * @returns {Promise<Object>}  verification result (GREEN / YELLOW / RED)
 */
export const submitVerification = async (payload, sealId) => {
  const response = await API.post('/documents/verify', { ...payload, sealId });
  return response.data;
};
