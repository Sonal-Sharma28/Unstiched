import React from 'react';
import { cn } from '../../utils/cn';

const variantStyles = {
  primary: 'bg-primary-700 text-raised hover:bg-primary-600 dark:bg-primary-500 dark:text-background dark:hover:bg-primary-400 border border-transparent shadow-sm',
  secondary: 'bg-surface text-ink hover:bg-background border border-border shadow-sm',
  glass: 'bg-primary-500/10 dark:bg-primary-500/15 backdrop-blur-xl border border-primary-500/20 dark:border-primary-500/20 shadow-[0_8px_32px_rgba(47,74,54,0.12)] text-primary-700 dark:text-primary-300 hover:bg-primary-500/20 dark:hover:bg-primary-500/25 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(47,74,54,0.2)] transition-all duration-300',
  ghost: 'bg-transparent text-ink hover:bg-primary-100/50 dark:hover:bg-primary-100/10',
  danger: 'bg-danger text-raised hover:opacity-90 shadow-sm border border-transparent',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-2 flex items-center justify-center',
};

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});
Button.displayName = 'Button';
