import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';
import { ChevronLeftIcon } from '../ui/Icons'; // We'll rotate it down

export function SelectField({ id, options, value, onChange, onBlur, error, allowOther, disabled }) {
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState('');

  // Check on mount if current value is an option or "other"
  useEffect(() => {
    if (value && !options.includes(value)) {
      if (allowOther) {
        setIsOther(true);
        setOtherValue(value);
      }
    } else {
      setIsOther(false);
    }
  }, [value, options, allowOther]);

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === '__other__') {
      setIsOther(true);
      onChange(otherValue);
    } else {
      setIsOther(false);
      onChange(val);
    }
  };

  const handleOtherChange = (e) => {
    const val = e.target.value;
    setOtherValue(val);
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="relative">
        <select
          id={id}
          value={isOther ? '__other__' : (value || '')}
          onChange={handleSelectChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            "appearance-none flex h-12 w-full rounded-xl border border-border bg-raised px-4 py-2 text-base text-ink",
            "transition-shadow",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger"
          )}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
          {allowOther && <option value="__other__">Other...</option>}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted">
          <ChevronLeftIcon className="w-4 h-4 -rotate-90" />
        </div>
      </div>
      
      {isOther && (
        <div className="animate-fade-up">
          <Input
            placeholder="Please specify..."
            value={otherValue}
            onChange={handleOtherChange}
            onBlur={onBlur}
            disabled={disabled}
            error={error}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
