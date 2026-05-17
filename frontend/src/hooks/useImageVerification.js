/**
 * useImageVerification
 *
 * React hook managing the entire image verification lifecycle.
 * Wraps the imageVerificationProcessor pipeline with state management.
 *
 * State managed:
 *  - loading:  boolean — is processing active
 *  - progress: { stage, percent } — current pipeline stage
 *  - result:   Object | null — final verification payload
 *  - error:    string | null — error message if failed
 *
 * Usage:
 *   const { processImage, loading, progress, result, error, reset } = useImageVerification();
 */
import { useState, useCallback } from 'react';
import {
  processImageForVerification,
  IMAGE_STAGES,
} from '../utils/imageVerificationProcessor';

const useImageVerification = () => {
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState({ stage: '', percent: 0 });
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);

  const processImage = useCallback(async (imageFile) => {
    // Reset for new run
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress({ stage: '', percent: 0 });

    try {
      const payload = await processImageForVerification(
        imageFile,
        (stage, percent) => {
          setProgress({ stage, percent });
        },
      );

      setResult(payload);
      return payload;
    } catch (err) {
      const message = err.message || 'Image processing failed';
      setError(message);
      setProgress({ stage: IMAGE_STAGES.ERROR, percent: 0 });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setProgress({ stage: '', percent: 0 });
    setResult(null);
    setError(null);
  }, []);

  return {
    processImage,
    loading,
    progress,
    result,
    error,
    reset,
  };
};

export default useImageVerification;
