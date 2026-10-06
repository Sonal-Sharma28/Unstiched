import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { HeartIcon } from '../ui/Icons';
import { downloadImage } from '../../utils/downloadImage';

export function Lightbox({ outputs, initialIndex, onClose, onLike, templateName }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [downloading, setDownloading] = useState(false);
  const containerRef = useRef(null);
  
  const currentOutput = outputs[currentIndex];
  
  // Preload neighbors
  useEffect(() => {
    const preload = (index) => {
      if (index >= 0 && index < outputs.length) {
        const img = new Image();
        img.src = outputs[index].url;
      }
    };
    preload(currentIndex - 1);
    preload(currentIndex + 1);
  }, [currentIndex, outputs]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, outputs.length - 1));
  }, [outputs.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation & Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Swipe handling
  const touchStartRef = useRef(null);
  const handleTouchStart = (e) => { touchStartRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartRef.current = null;
  };

  const handleDownload = async () => {
    setDownloading(true);
    await downloadImage(currentOutput.url, `studio-${templateName || 'design'}-${currentIndex + 1}.jpg`);
    setTimeout(() => setDownloading(false), 2000);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-8 animate-fade-in touch-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink/90 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Popup Card */}
      <div className="relative z-10 w-full max-w-4xl h-[95dvh] sm:h-auto sm:max-h-[85vh] flex flex-col bg-surface dark:bg-raised rounded-2xl shadow-2xl border border-border overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-surface dark:bg-raised">
          <div className="font-mono text-sm tracking-wider text-muted">
            {currentIndex + 1} / {outputs.length}
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 rounded-full text-muted hover:text-ink dark:hover:text-raised hover:bg-ink/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="Close lightbox"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image Container */}
        <div 
          ref={containerRef}
          className="relative flex-1 min-h-0 bg-black/5 dark:bg-black/40 flex items-center justify-center overflow-hidden group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            key={currentOutput.url}
            src={currentOutput.url} 
            alt={`Result ${currentIndex + 1}`} 
            className="w-full h-full object-contain pointer-events-none animate-scale-in p-2 sm:p-4"
          />

          {/* Navigation Chevrons */}
          {currentIndex > 0 && (
            <button onClick={handlePrev} className="absolute left-2 sm:left-4 p-2 rounded-full bg-surface/90 text-ink shadow-sm border border-border hover:bg-surface hover:scale-105 transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:outline-none">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {currentIndex < outputs.length - 1 && (
            <button onClick={handleNext} className="absolute right-2 sm:right-4 p-2 rounded-full bg-surface/90 text-ink shadow-sm border border-border hover:bg-surface hover:scale-105 transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:outline-none">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-border bg-surface dark:bg-raised">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-raised hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm focus:outline-none"
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Saved
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </>
              )}
            </button>
            <button 
              onClick={() => onLike(currentOutput.id)}
              className="p-2.5 rounded-xl bg-surface border border-border text-ink hover:bg-ink/5 dark:hover:bg-white/5 transition-colors shadow-sm focus:outline-none"
              aria-label={currentOutput.liked ? "Unlike" : "Like"}
            >
              <HeartIcon filled={currentOutput.liked} className={cn("w-5 h-5", currentOutput.liked ? "text-red-500 animate-pop" : "")} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
