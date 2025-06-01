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
      <div className={`admin-form-group ${fullWidth ? 'admin-w-full' : ''} ${className}`}>
        {label && (
          <label
            className={`admin-form-label ${props.required ? 'admin-form-label-required' : ''}`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          className={`admin-form-control ${error ? 'admin-form-control-error' : ''}`}
          ref={ref}
          {...props}
        />
        {helperText && !error && (
          <p className="admin-form-text admin-form-helper-text">{helperText}</p>
        )}
        {error && <p className="admin-form-text admin-form-error-text">{error}</p>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export { TextField };
