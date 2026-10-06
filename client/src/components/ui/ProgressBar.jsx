import React from 'react';
import { cn } from '../../utils/cn';

export function ProgressBar({ progress, label, className }) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-ink truncate pr-4">{label}</span>
        <span className="text-muted tabular-nums">{safeProgress}%</span>
      </div>
      <div
        className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border"
        role="progressbar"
        aria-valuenow={safeProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300 ease-out"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
