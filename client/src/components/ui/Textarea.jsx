import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef(({ className, error, maxLength, value, ...props }, ref) => {
  return (
    <div className="relative">
      <textarea
        ref={ref}
        maxLength={maxLength}
        value={value}
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-border bg-raised px-4 py-3 text-base text-ink placeholder:text-muted/60",
          "transition-shadow",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-danger",
          className
        )}
        {...props}
      />
      {maxLength && (
        <div className="absolute bottom-2 right-2 text-xs text-muted pointer-events-none bg-raised/80 px-1 rounded">
          {String(value || '').length}/{maxLength}
        </div>
      )}
    </div>
  );
});
Textarea.displayName = 'Textarea';
