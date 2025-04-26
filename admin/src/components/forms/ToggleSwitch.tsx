'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';

export interface ToggleSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ className = '', label, helperText, error, checked = false, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setIsChecked(newChecked);
      if (onChange) {
        onChange(newChecked);
      }
    };

    return (
      <div className={`form-field ${className}`}>
        <label className="form-toggle">
          <input
            type="checkbox"
            className="form-toggle-input"
            checked={isChecked}
            onChange={handleChange}
            ref={ref}
            {...props}
          />
          <div className="form-toggle-slider" />
          {label && (
            <span className="form-toggle-label">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
        </label>
        {helperText && !error && (
          <p className="form-helper-text">{helperText}</p>
        )}
        {error && <p className="form-error-text">{error}</p>}
      </div>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';

export { ToggleSwitch };
