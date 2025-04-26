'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, helperText, error, fullWidth = false, options, onChange, placeholder, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`form-field ${fullWidth ? 'form-field-full' : ''} ${className}`}>
        {label && (
          <label
            className={`form-label ${props.required ? 'form-label-required' : ''}`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <select
          className={`form-select ${error ? 'form-select-error' : ''}`}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && (
          <p className="form-helper-text">{helperText}</p>
        )}
        {error && <p className="form-error-text">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
