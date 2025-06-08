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
      <div className={`admin-form-group ${fullWidth ? 'admin-w-full' : ''} ${className}`}>
        {label && (
          <label
            className={`admin-form-label ${props.required ? 'admin-form-label-required' : ''}`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <select
          className={`admin-form-control admin-form-select ${error ? 'admin-form-control-error' : ''}`}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          <option>--選択して下さい--</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && (
          <p className="admin-form-text admin-form-helper-text">{helperText}</p>
        )}
        {error && <p className="admin-form-text admin-form-error-text">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
