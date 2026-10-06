import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-surface text-muted border-border",
    primary: "bg-primary-100 text-primary-700 border-primary-100 dark:bg-primary-700/30 dark:text-primary-400 dark:border-primary-700/50",
    success: "bg-accent-sage/20 text-primary-700 dark:text-accent-sage border-accent-sage/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
