'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className = '', label, helperText, error, fullWidth = false, ...props }, ref) => {
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
        <input
          className={`form-input ${error ? 'form-input-error' : ''}`}
          ref={ref}
          {...props}
        />
        {helperText && !error && (
          <p className="form-helper-text">{helperText}</p>
        )}
        {error && <p className="form-error-text">{error}</p>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export { TextField };
