import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border border-border bg-raised px-4 py-2 text-base text-ink placeholder:text-muted/60",
        "transition-shadow",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-danger",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';
