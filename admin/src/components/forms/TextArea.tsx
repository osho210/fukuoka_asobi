'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
        <textarea
          className={`admin-form-control admin-form-textarea ${error ? 'admin-form-control-error' : ''}`}
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

TextArea.displayName = 'TextArea';

export { TextArea };
