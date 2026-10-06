import { useState, useEffect, useCallback, useRef } from 'react';
import { getJobStatus } from '../api/endpoints';

export function useJobPolling(jobId) {
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState('queued');
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const consecutiveFailuresRef = useRef(0);
  const isMountedRef = useRef(true);

  const poll = useCallback(async () => {
    if (!jobId || !isMountedRef.current || document.hidden) return;
    
    abortControllerRef.current = new AbortController();
    setIsPolling(true);

    try {
      const data = await getJobStatus(jobId, { signal: abortControllerRef.current.signal });
      
      if (!isMountedRef.current) return;
      
      setJob(data);
      setStatus(data.status);
      consecutiveFailuresRef.current = 0; // Reset on success

      if (data.status !== 'complete' && data.status !== 'failed') {
        timeoutRef.current = setTimeout(poll, 3000);
      } else {
        setIsPolling(false);
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      if (err.name === 'AbortError') return;

      consecutiveFailuresRef.current += 1;
      
      if (err.status === 404) {
        setError('run not found');
        setStatus('failed');
        setIsPolling(false);
      } else if (consecutiveFailuresRef.current >= 3) {
        setError('connection lost');
        setIsPolling(false);
      } else {
        // Retry with backoff
        timeoutRef.current = setTimeout(poll, 1000 * Math.pow(2, consecutiveFailuresRef.current));
      }
    }
  }, [jobId]);

  useEffect(() => {
    isMountedRef.current = true;
    if (jobId) {
      setError(null);
      setJob(null);
      setStatus('queued');
      consecutiveFailuresRef.current = 0;
      poll();
    }

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [jobId, poll]);

  // Handle document visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isPolling && status !== 'complete' && status !== 'failed' && !error) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        poll();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPolling, status, error, poll]);

  const retry = useCallback(() => {
    if (jobId) {
      setError(null);
      consecutiveFailuresRef.current = 0;
      poll();
    }
  }, [jobId, poll]);

  return { job, status, error, isPolling, retry };
}
