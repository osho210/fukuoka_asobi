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
      <div className={`form-field ${fullWidth ? 'form-field-full' : ''} ${className}`}>
        {label && (
          <label
            className={`form-label ${props.required ? 'form-label-required' : ''}`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <textarea
          className={`form-textarea ${error ? 'form-textarea-error' : ''}`}
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

TextArea.displayName = 'TextArea';

export { TextArea };
