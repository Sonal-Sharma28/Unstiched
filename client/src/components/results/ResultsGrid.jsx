import React, { useState } from 'react';
import { ResultCard } from './ResultCard';
import { Lightbox } from './Lightbox';
import { useOptimisticLikes } from '../../hooks/useOptimisticLikes';
import { Button } from '../ui/Button';
import { HeartIcon } from '../ui/Icons';
import { downloadImage } from '../../utils/downloadImage';

export function ResultsGrid({ outputs, jobId, templateName, onReset }) {
  const { outputs: localOutputs, toggleLike } = useOptimisticLikes(outputs, jobId);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const likedCount = localOutputs.filter(o => o.liked).length;

  return (
    <div className="space-y-6">
      {/* Quiet Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <HeartIcon filled={likedCount > 0} className={`w-4 h-4 ${likedCount > 0 ? 'text-red-500' : ''}`} />
          {likedCount} liked
        </div>
        <div className="flex items-center gap-3">
          {onReset && (
            <Button variant="primary" size="lg" onClick={onReset} className="px-6 rounded-full font-medium shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Run
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {localOutputs.map((output, i) => (
          <ResultCard
            key={output.id}
            output={output}
            index={i}
            onLike={toggleLike}
            onClick={() => setLightboxIndex(i)}
            className="animate-fade-up"
            style={{
              animationDelay: `${i * 100}ms`,
              aspectRatio: output.width && output.height ? `${output.width}/${output.height}` : '1 / 1'
            }}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          outputs={localOutputs}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onLike={toggleLike}
          templateName={templateName}
        />
      )}
    </div>
  );
}
