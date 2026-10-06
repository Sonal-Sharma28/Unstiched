import { useState, useEffect, useCallback } from 'react';
import { getTemplates } from '../api/endpoints';

export function useTemplates() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const controller = new AbortController();

    try {
      const templates = await getTemplates({ signal: controller.signal });
      setData(templates);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load templates.');
      }
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const abort = fetchTemplates();
    return () => {
      abort.then(cancel => cancel && cancel());
    };
  }, [fetchTemplates]);

  return { data, isLoading, error, retry: fetchTemplates };
}
