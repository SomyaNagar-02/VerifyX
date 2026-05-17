/**
 * runImageOCR
 *
 * Extracts text from images and scanned documents using Tesseract.js.
 * Optimized for image-based verification flow (Phase 4).
 *
 * Features:
 *  - Progress callback for UI feedback
 *  - Confidence scoring
 *  - Async processing
 *  - Graceful error handling
 *
 * @param {File|Blob|string} source      — image File, Blob, or data URL
 * @param {Object}           options
 * @param {Function}         options.onProgress — (percent: 0-100) => void
 * @param {string}           options.language   — Tesseract language code (default 'eng')
 * @returns {Promise<{ text: string, confidence: number, wordCount: number }>}
 */
import Tesseract from 'tesseract.js';

export const runImageOCR = async (source, options = {}) => {
  if (!source) throw new Error('No image source provided for OCR');

  const { onProgress = null, language = 'eng' } = options;

  try {
    const result = await Tesseract.recognize(source, language, {
      logger: (info) => {
        if (
          onProgress &&
          info.status === 'recognizing text' &&
          info.progress != null
        ) {
          onProgress(Math.round(info.progress * 100));
        }
      },
    });

    const text = (result.data.text || '').trim();
    const confidence = result.data.confidence || 0;
    const words = text.split(/\s+/).filter(Boolean);

    return {
      text,
      confidence,
      wordCount: words.length,
    };
  } catch (error) {
    throw new Error(`Image OCR failed: ${error.message}`);
  }
};
