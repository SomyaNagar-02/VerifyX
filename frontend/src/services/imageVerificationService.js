/**
 * imageVerificationService
 *
 * Prepares image verification payloads for backend submission.
 * Strips browser-only data (preview images, processing artifacts),
 * keeps only what the server needs for seal creation / verification.
 *
 * Zero-storage policy: original images are NEVER sent to the backend.
 * Only cryptographic/perceptual hashes, OCR text, and metadata are transmitted.
 */
import API from './api';

/**
 * prepareImageSealPayload
 *
 * Transforms the image verification result into the shape the backend expects.
 *
 * @param {Object} imageResult — output from processImageForVerification
 * @param {Object} meta        — additional metadata (issuedTo, documentType, etc.)
 * @returns {Object}             backend-ready payload
 */
export const prepareImageSealPayload = (imageResult, meta = {}) => {
  if (!imageResult) throw new Error('No image verification result to prepare');

  return {
    // Perceptual hash (visual identity)
    pHash: imageResult.pHash,
    pHashBits: imageResult.pHashBits,

    // OCR data
    ocrText: imageResult.ocrText || '',
    ocrConfidence: imageResult.ocrConfidence || 0,

    // Structured fields
    fields: imageResult.fields || {},
    fieldCompleteness: imageResult.fieldCompleteness || {},

    // File metadata
    fileType: 'IMAGE',
    fileName: imageResult.fileName,
    fileSize: imageResult.fileSize,

    // User-supplied metadata
    issuedTo: meta.issuedTo || imageResult.fields?.name || '',
    documentType: meta.documentType || 'Other',
  };
};

/**
 * prepareImageVerifyPayload
 *
 * Transforms the image verification result for verification against an existing seal.
 *
 * @param {Object} imageResult — output from processImageForVerification
 * @returns {Object}             verification payload
 */
export const prepareImageVerifyPayload = (imageResult) => {
  if (!imageResult) throw new Error('No image verification result to prepare');

  return {
    pHash: imageResult.pHash,
    ocrText: imageResult.ocrText || '',
    fields: imageResult.fields || {},
    fileType: 'IMAGE',
  };
};

/**
 * submitImageSeal
 *
 * Sends the processed image payload to the backend to create a Seal ID.
 *
 * @param {Object} payload — from prepareImageSealPayload
 * @returns {Promise<Object>}  backend response with sealId
 */
export const submitImageSeal = async (payload) => {
  const response = await API.post('/documents/seal', payload);
  return response.data;
};

/**
 * submitImageVerification
 *
 * Sends a pHash + fields payload to the backend for verification against an existing seal.
 *
 * @param {Object} payload — from prepareImageVerifyPayload
 * @param {string} sealId  — the Seal ID to verify against
 * @returns {Promise<Object>}  verification result (GREEN / YELLOW / RED)
 */
export const submitImageVerification = async (payload, sealId) => {
  const response = await API.post('/documents/verify', { ...payload, sealId });
  return response.data;
};
