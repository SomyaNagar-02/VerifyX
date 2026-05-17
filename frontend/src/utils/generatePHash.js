/**
 * generatePHash
 *
 * Generates a perceptual hash (pHash) for visual similarity estimation.
 * Uses blockhash-core's bmvbhash algorithm with ImageData from the Canvas API.
 *
 * Unlike SHA-256 (content identity), pHash tolerates:
 *  - screenshots
 *  - rescans
 *  - compression differences
 *  - brightness / contrast changes
 *  - minor resizing
 *
 * @param {File|Blob|string} source   — image File, Blob, or data URL
 * @param {Object}           options
 * @param {number}           options.bits — hash resolution (default 16, produces 256-bit hash)
 * @returns {Promise<{ hash: string, bits: number }>}
 */
import { bmvbhash } from 'blockhash-core';

const DEFAULT_BITS = 16; // 16×16 = 256-bit hash — good accuracy/speed tradeoff

/**
 * Load source into an ImageData object via Canvas.
 */
const getImageData = (source) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const onLoad = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };

    img.onload = onLoad;
    img.onerror = () => reject(new Error('Failed to load image for pHash'));

    if (source instanceof Blob || source instanceof File) {
      const url = URL.createObjectURL(source);
      img.onload = () => {
        URL.revokeObjectURL(url);
        onLoad();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image file for pHash'));
      };
      img.src = url;
    } else if (typeof source === 'string') {
      // Data URL or remote URL
      img.src = source;
    } else {
      reject(new Error('Invalid source type for pHash generation'));
    }
  });
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const generatePHash = async (source, options = {}) => {
  if (!source) throw new Error('No image source provided for pHash');

  const bits = options.bits || DEFAULT_BITS;

  try {
    const imageData = await getImageData(source);
    const hash = bmvbhash(imageData, bits);

    return {
      hash,
      bits,
    };
  } catch (error) {
    throw new Error(`pHash generation failed: ${error.message}`);
  }
};

/**
 * Generate pHash directly from an ImageData object (skip image loading).
 * Useful when image has already been preprocessed.
 *
 * @param {ImageData} imageData — Canvas ImageData
 * @param {number}    bits      — hash resolution
 * @returns {{ hash: string, bits: number }}
 */
export const generatePHashFromImageData = (imageData, bits = DEFAULT_BITS) => {
  if (!imageData) throw new Error('No ImageData provided');
  const hash = bmvbhash(imageData, bits);
  return { hash, bits };
};
