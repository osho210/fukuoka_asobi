'use client';

import { forwardRef, useEffect, useState } from 'react';
import { SelectOption } from './Select';

export interface MultiSelectAsyncProps {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  values?: string[];
  onChange?: (values: string[]) => void;
  loadOptions: () => Promise<SelectOption[]>;
  className?: string;
}

const MultiSelectAsync = forwardRef<HTMLDivElement, MultiSelectAsyncProps>(
  ({ loadOptions, values = [], onChange, label, helperText, error, fullWidth = false, required, disabled, className = '', ...props }, ref) => {
    const [options, setOptions] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [selectedValues, setSelectedValues] = useState<string[]>(values);

    useEffect(() => {
      const fetchOptions = async () => {
        try {
          setLoading(true);
          const data = await loadOptions();
          setOptions(data);
          setLoadError(null);
        } catch (err) {
          console.error('Failed to load options:', err);
          setLoadError('オプションの読み込みに失敗しました');
        } finally {
          setLoading(false);
        }
      };

      fetchOptions();
    }, [loadOptions]);

    useEffect(() => {
      setSelectedValues(values);
    }, [values]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setSelectedValues(selectedOptions);
      if (onChange) {
        onChange(selectedOptions);
      }
    };

    return (
      <div className={`form-field ${fullWidth ? 'form-field-full' : ''} ${className}`} ref={ref}>
        {label && (
          <label
            className={`form-label ${required ? 'form-label-required' : ''}`}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <select
          multiple
          className={`form-multiselect ${(error || loadError) ? 'form-multiselect-error' : ''}`}
          value={selectedValues}
          onChange={handleChange}
          disabled={disabled || loading}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && !loadError && (
          <p className="form-helper-text">{helperText}</p>
        )}
        {(error || loadError) && (
          <p className="form-error-text">{error || loadError}</p>
        )}
      </div>
    );
  }
);

MultiSelectAsync.displayName = 'MultiSelectAsync';

export { MultiSelectAsync };
