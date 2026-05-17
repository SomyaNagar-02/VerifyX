/**
 * imageVerificationProcessor
 *
 * Main orchestration pipeline for browser-side image verification.
 * Coordinates all image processing utilities into a single flow:
 *
 *   Upload → Preprocess → Generate pHash → Run OCR → Extract Fields → Build Payload
 *
 * This processor does NOT do comparison — it prepares the image data.
 * For comparison against a stored document, use calculateSimilarity.
 *
 * @param {File}     imageFile   — the uploaded image File
 * @param {Function} onProgress  — (stage: string, percent: number) => void
 * @returns {Promise<Object>}      image verification payload
 */
import { preprocessImage } from './preprocessImage';
import { generatePHash, generatePHashFromImageData } from './generatePHash';
import { runImageOCR } from './runImageOCR';
import { extractImageFields } from './extractImageFields';

// ─── Processing stages ─────────────────────────────────────────────────────────

export const IMAGE_STAGES = {
  PREPROCESSING: 'Preprocessing image...',
  PHASH:         'Generating perceptual hash...',
  OCR:           'Running OCR extraction...',
  FIELDS:        'Extracting structured fields...',
  COMPLETE:      'Processing complete',
  ERROR:         'Processing failed',
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const processImageForVerification = async (imageFile, onProgress = () => {}) => {
  if (!imageFile) throw new Error('No image file provided');

  const startTime = Date.now();

  // ── Step 1: Preprocess the image ─────────────────────────────────────────
  onProgress(IMAGE_STAGES.PREPROCESSING, 5);

  let preprocessed;
  try {
    preprocessed = await preprocessImage(imageFile, {
      maxDimension: 1024,
      grayscale: true,
      normalize: true,
    });
  } catch (error) {
    throw new Error(`Image preprocessing failed: ${error.message}`);
  }

  onProgress(IMAGE_STAGES.PREPROCESSING, 15);

  // ── Step 2: Generate perceptual hash ─────────────────────────────────────
  onProgress(IMAGE_STAGES.PHASH, 20);

  let pHashResult;
  try {
    // Use the original image (not grayscale) for more accurate pHash
    pHashResult = await generatePHash(imageFile);
  } catch (error) {
    // Fallback: use preprocessed ImageData
    console.warn('pHash from original failed, using preprocessed:', error.message);
    try {
      pHashResult = generatePHashFromImageData(preprocessed.imageData);
    } catch (fallbackError) {
      throw new Error(`pHash generation failed: ${fallbackError.message}`);
    }
  }

  onProgress(IMAGE_STAGES.PHASH, 30);

  // ── Step 3: Run OCR extraction ──────────────────────────────────────────
  onProgress(IMAGE_STAGES.OCR, 35);

  let ocrResult;
  try {
    ocrResult = await runImageOCR(imageFile, {
      onProgress: (ocrPercent) => {
        // Map OCR progress (0-100) into overall 35-80 range
        onProgress(IMAGE_STAGES.OCR, 35 + Math.round(ocrPercent * 0.45));
      },
    });
  } catch (error) {
    throw new Error(`OCR extraction failed: ${error.message}`);
  }

  onProgress(IMAGE_STAGES.OCR, 80);

  // ── Step 4: Extract structured fields ────────────────────────────────────
  onProgress(IMAGE_STAGES.FIELDS, 85);

  const { fields, completeness } = extractImageFields(ocrResult.text);

  onProgress(IMAGE_STAGES.FIELDS, 95);

  // ── Step 5: Build final verification payload ─────────────────────────────
  onProgress(IMAGE_STAGES.COMPLETE, 100);

  const processingTimeMs = Date.now() - startTime;

  return {
    // Perceptual hash
    pHash: pHashResult.hash,
    pHashBits: pHashResult.bits,

    // OCR data
    ocrText: ocrResult.text,
    ocrConfidence: ocrResult.confidence,
    ocrWordCount: ocrResult.wordCount,

    // Structured fields
    fields,
    fieldCompleteness: completeness,

    // Image metadata
    fileType: 'IMAGE',
    fileName: imageFile.name,
    fileSize: imageFile.size,
    imageDimensions: {
      original: { width: preprocessed.originalWidth, height: preprocessed.originalHeight },
      processed: { width: preprocessed.width, height: preprocessed.height },
    },

    // Preview data
    preprocessedPreview: preprocessed.dataUrl,

    // Timing
    processingTimeMs,
  };
};
