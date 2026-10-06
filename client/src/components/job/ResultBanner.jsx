import React from 'react';
import { cn } from '../../utils/cn';
import { AlertIcon, RefreshIcon } from '../ui/Icons';
import { Button } from '../ui/Button';

export function ResultBanner({ type, title, description, actionText, onAction, className }) {
  const isFailed = type === 'failed';

  return (
    <div className={cn(
      "rounded-2xl p-6 border flex flex-col sm:flex-row gap-4 sm:items-center justify-between animate-fade-in",
      isFailed ? "bg-danger/5 border-danger/20 text-danger" : "bg-accent-clay/10 border-accent-clay/20 text-accent-clay",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-2 rounded-full mt-1 shrink-0",
          isFailed ? "bg-danger/10" : "bg-accent-clay/20"
        )}>
          {isFailed ? <AlertIcon className="w-5 h-5" /> : <RefreshIcon className="w-5 h-5" />}
        </div>
        <div>
          <h3 className={cn(
            "font-display text-lg font-medium mb-1",
            isFailed ? "text-danger" : "text-ink"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-sm leading-relaxed",
            isFailed ? "text-danger/80" : "text-muted"
          )}>
            {description}
          </p>
        </div>
      </div>
      {onAction && (
        <Button 
          variant={isFailed ? "danger" : "primary"} 
          onClick={onAction}
          className="shrink-0 rounded-full px-6 shadow-sm"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
