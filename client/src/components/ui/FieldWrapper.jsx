import React from 'react';
import { cn } from '../../utils/cn';

export function FieldWrapper({ id, label, required, helperText, errorText, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink flex justify-between">
        <span>
          {label}
          {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </span>
      </label>
      {children}
      {(helperText || errorText) && (
        <p className={cn("text-xs", errorText ? "text-danger" : "text-muted")} id={`${id}-description`}>
          {errorText || helperText}
        </p>
      )}
    </div>
  );
}
