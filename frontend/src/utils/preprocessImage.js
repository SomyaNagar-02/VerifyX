/**
 * preprocessImage
 *
 * Prepares an image for OCR and pHash generation using the browser Canvas API.
 * Processing is done entirely client-side — no server upload required.
 *
 * Pipeline:
 *  1. Load image into an off-screen canvas
 *  2. Resize to a consistent max dimension (preserves aspect ratio)
 *  3. Convert to grayscale
 *  4. Normalize brightness/contrast
 *  5. Return processed ImageData + data URL
 *
 * @param {File|Blob|string} source — image File, Blob, or data URL
 * @param {Object}           opts
 * @param {number}           opts.maxDimension — max width/height (default 1024)
 * @param {boolean}          opts.grayscale    — convert to grayscale (default true)
 * @param {boolean}          opts.normalize    — normalize brightness (default true)
 * @returns {Promise<{ imageData: ImageData, dataUrl: string, width: number, height: number }>}
 */

const DEFAULT_OPTIONS = {
  maxDimension: 1024,
  grayscale: true,
  normalize: true,
};

/**
 * Load a source (File, Blob, or data URL string) into an HTMLImageElement.
 */
const loadImage = (source) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));

    if (source instanceof Blob || source instanceof File) {
      const url = URL.createObjectURL(source);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image from file'));
      };
      img.src = url;
    } else if (typeof source === 'string') {
      img.src = source;
    } else {
      reject(new Error('Invalid image source type'));
    }
  });
};

/**
 * Calculate resized dimensions while preserving aspect ratio.
 */
const getResizedDimensions = (width, height, maxDim) => {
  if (width <= maxDim && height <= maxDim) return { width, height };
  const ratio = Math.min(maxDim / width, maxDim / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};

/**
 * Convert ImageData pixels to grayscale in place.
 */
const applyGrayscale = (imageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // Luminance formula (Rec. 709)
    const gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    // Alpha channel unchanged
  }
  return imageData;
};

/**
 * Normalize brightness by stretching histogram to full 0-255 range.
 */
const normalizeBrightness = (imageData) => {
  const data = imageData.data;

  // Find min/max pixel values (use red channel since we've grayscaled)
  let min = 255;
  let max = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < min) min = data[i];
    if (data[i] > max) max = data[i];
  }

  // Avoid division by zero if image is completely flat
  const range = max - min;
  if (range === 0) return imageData;

  const factor = 255 / range;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.round((data[i] - min) * factor);
    data[i + 1] = Math.round((data[i + 1] - min) * factor);
    data[i + 2] = Math.round((data[i + 2] - min) * factor);
  }
  return imageData;
};

// ─── Main export ─────────────────────────────────────────────────────────────

export const preprocessImage = async (source, options = {}) => {
  if (!source) throw new Error('No image source provided');

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 1. Load image
  const img = await loadImage(source);
  const originalWidth = img.naturalWidth || img.width;
  const originalHeight = img.naturalHeight || img.height;

  // 2. Resize
  const { width, height } = getResizedDimensions(
    originalWidth,
    originalHeight,
    opts.maxDimension,
  );

  // 3. Draw onto canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, width, height);

  // 4. Get pixel data
  let imageData = ctx.getImageData(0, 0, width, height);

  // 5. Grayscale
  if (opts.grayscale) {
    imageData = applyGrayscale(imageData);
  }

  // 6. Normalize brightness
  if (opts.normalize) {
    imageData = normalizeBrightness(imageData);
  }

  // Write processed data back to canvas for data URL export
  ctx.putImageData(imageData, 0, 0);

  return {
    imageData,
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
    originalWidth,
    originalHeight,
  };
};
