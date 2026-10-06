import React from 'react';
import { cn } from '../../utils/cn';
import { CheckIcon } from '../ui/Icons';

const stages = [
  { id: 'queued', label: 'Queued' },
  { id: 'processing', label: 'Processing' },
  { id: 'stage_1', label: 'Composing' },
  { id: 'stage_2', label: 'Rendering' },
  { id: 'stage_3', label: 'Exporting' },
];

export function StageStepper({ currentStatus, className }) {
  // Find current index
  let currentIndex = stages.findIndex(s => s.id === currentStatus);
  if (currentStatus === 'complete' || currentStatus === 'failed') {
    currentIndex = stages.length; // all done or stopped
  }

  return (
    <div className={cn("flex items-center justify-between w-full relative", className)}>
      {/* Background track */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-border -z-10 -translate-y-1/2" />
      
      {/* Progress track */}
      <div 
        className="absolute top-1/2 left-0 h-[2px] bg-primary-500 -z-10 -translate-y-1/2 transition-all duration-500" 
        style={{ width: `${Math.max(0, Math.min(100, (currentIndex / (stages.length - 1)) * 100))}%` }} 
      />

      {stages.map((stage, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        
        return (
          <div key={stage.id} className="flex flex-col items-center gap-2 bg-surface px-1">
            <div 
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 text-[10px] font-medium border-2",
                isDone ? "bg-primary-500 border-primary-500 text-raised" : 
                isActive ? "bg-surface border-primary-500 text-primary-700" : 
                "bg-surface border-border text-muted"
              )}
            >
              {isDone ? <CheckIcon className="w-3.5 h-3.5" /> : (i + 1)}
            </div>
            <span className={cn(
              "text-[10px] sm:text-xs font-medium uppercase tracking-wider hidden sm:block",
              (isDone || isActive) ? "text-ink" : "text-muted"
            )}>
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
