import React from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Toggle } from '../ui/Toggle';
import { SelectField } from './SelectField';
import { FileField } from './FileField';
import { FieldWrapper } from '../ui/FieldWrapper';

export function FieldRenderer({ field, value, error, onChange, onBlur, disabled }) {
  const { id, type, label, required, accept, options, allowOther, maxLength, helperText } = field;

  const handleChange = (val) => onChange(id, val);
  const handleBlur = () => onBlur(id);

  let control = null;

  switch (type) {
    case 'textarea':
      control = (
        <Textarea
          id={id}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          error={error}
          maxLength={maxLength}
        />
      );
      break;
    case 'select':
      control = (
        <SelectField
          id={id}
          options={options || []}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          error={error}
          allowOther={allowOther}
        />
      );
      break;
    case 'toggle':
      control = (
        <Toggle
          checked={!!value}
          onChange={handleChange}
          disabled={disabled}
          aria-label={label}
        />
      );
      break;
    case 'file':
      control = (
        <FileField
          id={id}
          accept={accept}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          error={error}
        />
      );
      break;
    case 'text':
    default:
      control = (
        <Input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          error={error}
          maxLength={maxLength}
        />
      );
      break;
  }

  // Toggle layout is often better side-by-side
  if (type === 'toggle') {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-ink">{label}</label>
          {helperText && <span className="text-xs text-muted">{helperText}</span>}
        </div>
        {control}
      </div>
    );
  }

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      errorText={error}
      helperText={helperText}
    >
      {control}
    </FieldWrapper>
  );
}
