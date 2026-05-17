/**
 * detectFileType
 *
 * Identifies whether a file is PDF, IMAGE, or UNSUPPORTED
 * by checking both MIME type and file extension.
 *
 * @param {File} file — browser File object
 * @returns {{ type: 'PDF' | 'IMAGE' | 'UNSUPPORTED', mime: string, extension: string }}
 */

const PDF_MIMES   = ['application/pdf'];
const IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png'];

const PDF_EXTS    = ['.pdf'];
const IMAGE_EXTS  = ['.jpg', '.jpeg', '.png'];

const getExtension = (filename = '') => {
  const idx = filename.lastIndexOf('.');
  return idx !== -1 ? filename.slice(idx).toLowerCase() : '';
};

export const detectFileType = (file) => {
  if (!file || !(file instanceof File)) {
    return { type: 'UNSUPPORTED', mime: '', extension: '' };
  }

  const mime = file.type.toLowerCase();
  const extension = getExtension(file.name);

  // PDF check
  if (PDF_MIMES.includes(mime) || PDF_EXTS.includes(extension)) {
    return { type: 'PDF', mime, extension };
  }

  // Image check
  if (IMAGE_MIMES.includes(mime) || IMAGE_EXTS.includes(extension)) {
    return { type: 'IMAGE', mime, extension };
  }

  return { type: 'UNSUPPORTED', mime, extension };
};

/**
 * Accepted MIME types string for <input accept="...">
 */
export const ACCEPTED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png';
export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * validateFile — checks type + size
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };

  const { type } = detectFileType(file);
  if (type === 'UNSUPPORTED') {
    return { valid: false, error: `Unsupported file type. Accepted: PDF, JPG, PNG` };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB` };
  }

  return { valid: true };
};
