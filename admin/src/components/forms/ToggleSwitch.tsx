'use client';

import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';

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

    // checked propが変更されたときに内部状態を更新
    useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setIsChecked(newChecked);
      if (onChange) {
        onChange(newChecked);
      }
    };

    return (
      <div className={`admin-form-group ${className}`}>
        <label className="admin-form-check">
          <input
            type="checkbox"
            className="admin-form-check-input"
            checked={isChecked}
            onChange={handleChange}
            ref={ref}
            {...props}
          />
          <div className="admin-form-toggle-slider" />
          {label && (
            <span className="admin-form-check-label">
              {label}
              {props.required && <span className="admin-text-danger admin-ml-1">*</span>}
            </span>
          )}
        </label>
        {helperText && !error && (
          <p className="admin-form-text admin-form-helper-text">{helperText}</p>
        )}
        {error && <p className="admin-form-text admin-form-error-text">{error}</p>}
      </div>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';

export { ToggleSwitch };
