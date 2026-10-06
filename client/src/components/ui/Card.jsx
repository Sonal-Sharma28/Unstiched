import React from 'react';
import { cn } from '../../utils/cn';

export const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-raised rounded-2xl border border-border shadow-soft transition-all duration-300 hover:shadow-soft-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';
