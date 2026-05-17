/**
 * runOCR
 *
 * Extracts text from images and scanned documents using Tesseract.js.
 * Supports progress callbacks for UI feedback.
 *
 * @param {File|string} source      — File object or image URL
 * @param {Function}    onProgress  — optional callback: (progress: 0-100) => void
 * @returns {Promise<{ text: string, confidence: number }>}
 */
import Tesseract from 'tesseract.js';

export const runOCR = async (source, onProgress = null) => {
  if (!source) throw new Error('No source provided for OCR');

  try {
    const result = await Tesseract.recognize(source, 'eng', {
      logger: (info) => {
        // Tesseract reports status/progress updates during processing
        if (onProgress && info.status === 'recognizing text' && info.progress != null) {
          onProgress(Math.round(info.progress * 100));
        }
      },
    });

    const text = result.data.text || '';
    const confidence = result.data.confidence || 0;

    return {
      text: text.trim(),
      confidence,
    };
  } catch (error) {
    throw new Error(`OCR processing failed: ${error.message}`);
  }
};
