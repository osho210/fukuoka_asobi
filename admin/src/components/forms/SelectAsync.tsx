'use client';

import { forwardRef, useEffect, useState } from 'react';
import { Select, SelectOption } from './Select';

export interface SelectAsyncProps {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  loadOptions: () => Promise<SelectOption[]>;
  className?: string;
}

const SelectAsync = forwardRef<HTMLSelectElement, SelectAsyncProps>(
  ({ loadOptions, value, onChange, ...props }, ref) => {
    const [options, setOptions] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchOptions = async () => {
        try {
          setLoading(true);
          const data = await loadOptions();
          setOptions(data);
          setError(null);
        } catch (err) {
          console.error('Failed to load options:', err);
          setError('オプションの読み込みに失敗しました');
        } finally {
          setLoading(false);
        }
      };

      fetchOptions();
    }, [loadOptions]);

    return (
      <Select
        ref={ref}
        options={options}
        value={value}
        onChange={onChange}
        disabled={props.disabled || loading}
        error={error || props.error}
        {...props}
      />
    );
  }
);

SelectAsync.displayName = 'SelectAsync';

export { SelectAsync };
