import { useState, useCallback, useEffect } from 'react';
import { setLike } from '../api/endpoints';

export function useOptimisticLikes(initialOutputs, jobId) {
  const [outputs, setOutputs] = useState([]);

  useEffect(() => {
    if (!initialOutputs) {
      setOutputs([]);
      return;
    }

    try {
      const localLikes = JSON.parse(localStorage.getItem('likedOutputs') || '{}');
      setOutputs(initialOutputs.map(o => ({
        ...o,
        liked: localLikes[o.id] !== undefined ? localLikes[o.id] : o.liked
      })));
    } catch (e) {
      setOutputs(initialOutputs);
    }
  }, [initialOutputs]);

  const toggleLike = useCallback((outputId) => {
    setOutputs(prev => {
      const output = prev.find(o => o.id === outputId);
      if (!output) return prev;
      
      const previousLiked = output.liked;
      const newLiked = !previousLiked;
      
      // 1. Optimistically update local storage
      try {
        const localLikes = JSON.parse(localStorage.getItem('likedOutputs') || '{}');
        if (newLiked) {
          localLikes[outputId] = true;
        } else {
          delete localLikes[outputId];
        }
        localStorage.setItem('likedOutputs', JSON.stringify(localLikes));
      } catch (e) {
        // ignore local storage errors
      }

      // 2. Make the API call and handle rollback
      setLike(jobId, outputId, newLiked).catch(err => {
        // Rollback state
        setOutputs(current => 
          current.map(o => o.id === outputId ? { ...o, liked: previousLiked } : o)
        );
        // Rollback localStorage
        try {
          const localLikes = JSON.parse(localStorage.getItem('likedOutputs') || '{}');
          if (previousLiked) {
            localLikes[outputId] = true;
          } else {
            delete localLikes[outputId];
          }
          localStorage.setItem('likedOutputs', JSON.stringify(localLikes));
        } catch (e) {
          // ignore
        }
      });

      // 3. Optimistically update state
      return prev.map(o => o.id === outputId ? { ...o, liked: newLiked } : o);
    });
  }, [jobId]);

  return { outputs, toggleLike };
}
