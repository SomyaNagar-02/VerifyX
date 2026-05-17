/**
 * useDocumentProcessing
 *
 * React hook that manages the entire document processing lifecycle.
 * Wraps the documentProcessor pipeline with state management for:
 *  - loading
 *  - progress (stage + percentage)
 *  - result (semantic verification payload)
 *  - error
 *
 * Usage:
 *   const { processDocument, loading, progress, result, error, reset } = useDocumentProcessing();
 */
import { useState, useCallback } from 'react';
import { processDocument as runProcessing, STAGES } from '../utils/file/documentProcessor';

const useDocumentProcessing = () => {
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState({ stage: '', percent: 0 });
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);

  const processDocument = useCallback(async (file) => {
    // Reset state for new processing run
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress({ stage: '', percent: 0 });

    try {
      const payload = await runProcessing(file, (stage, percent) => {
        setProgress({ stage, percent });
      });

      setResult(payload);
      return payload;
    } catch (err) {
      const message = err.message || 'Document processing failed';
      setError(message);
      setProgress({ stage: STAGES.ERROR, percent: 0 });
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
    processDocument,
    loading,
    progress,
    result,
    error,
    reset,
  };
};

export default useDocumentProcessing;
