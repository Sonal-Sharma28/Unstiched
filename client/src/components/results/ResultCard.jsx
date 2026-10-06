import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { HeartIcon, AlertIcon, RefreshIcon } from '../ui/Icons';
import { Skeleton } from '../ui/Skeleton';

export function ResultCard({ output, index, onLike, onClick, style, className }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = (e) => {
    e.stopPropagation();
    setError(false);
    setLoaded(false);
    setRetryKey(k => k + 1);
  };

  return (
    <div 
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-surface border border-border shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 cursor-zoom-in flex items-center justify-center",
        className
      )}
      style={style}
      onClick={() => onClick(output)}
    >
      {!loaded && !error && (
        <Skeleton className="absolute inset-0 w-full h-full z-10" />
      )}
      
      {error ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface p-4 text-center">
          <AlertIcon className="w-8 h-8 text-danger/50 mb-2" />
          <p className="text-sm text-muted mb-3">Failed to load image</p>
          <button 
            onClick={handleRetry}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-raised border border-border text-xs font-medium hover:bg-surface transition-colors"
          >
            <RefreshIcon className="w-3 h-3" /> Retry
          </button>
        </div>
      ) : (
        <img 
          key={retryKey}
          src={output.url} 
          alt={`Generated output ${index + 1}`} 
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Gradient Scrim - visible on hover for desktop, mostly transparent but always visible enough for touch */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none lg:pointer-events-auto" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent lg:hidden pointer-events-none" />
      
      {/* Index Label */}
      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-ink/40 backdrop-blur-md text-raised text-xs font-medium font-mono pointer-events-none">
        {String(index + 1).padStart(2, '0')}
      </div>
      
      {/* Like Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onLike(output.id); }}
        className="absolute bottom-3 right-3 p-2.5 rounded-full bg-surface/90 backdrop-blur-sm border border-border/50 text-ink lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:scale-110 hover:bg-surface focus:opacity-100 focus:outline-none lg:translate-y-2 lg:group-hover:translate-y-0"
        aria-label={output.liked ? "Unlike" : "Like"}
      >
        <HeartIcon filled={output.liked} className={cn("w-5 h-5 transition-colors", output.liked ? "text-red-500 animate-pop" : "")} />
      </button>
    </div>
  );
}
