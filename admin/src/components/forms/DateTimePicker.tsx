'use client';

import '@/styles/datetime-picker.css';

interface DateTimePickerProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
}

export function DateTimePicker({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  error,
  fullWidth = false,
}: DateTimePickerProps) {
  // ISO8601形式の日付文字列をHTML datetime-local形式に変換
  const formatToLocalDateTimeString = (isoString: string): string => {
    if (!isoString) return '';

    try {
      // ISO8601形式の日付文字列をDateオブジェクトに変換
      const date = new Date(isoString);

      // 無効な日付の場合は空文字列を返す
      if (isNaN(date.getTime())) return '';

      // YYYY-MM-DDThh:mm形式に変換（datetime-local入力用）
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
      console.error('日付変換エラー:', e);
      return '';
    }
  };

  // HTML datetime-local形式からISO8601形式に変換
  const formatToISOString = (localDateTimeString: string): string => {
    if (!localDateTimeString) return '';

    try {
      // datetime-local入力値をDateオブジェクトに変換
      const date = new Date(localDateTimeString);

      // 無効な日付の場合は空文字列を返す
      if (isNaN(date.getTime())) return '';

      // ISO8601形式に変換
      return date.toISOString();
    } catch (e) {
      console.error('日付変換エラー:', e);
      return '';
    }
  };

  // 入力値が変更されたときの処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // 入力値が空の場合は空文字列を返す
    if (!newValue) {
      onChange('');
      return;
    }

    // HTML datetime-local形式からISO8601形式に変換
    const isoDate = formatToISOString(newValue);
    onChange(isoDate);
  };

  return (
    <div className={`datetime-picker-container ${fullWidth ? 'full-width' : ''}`}>
      <label
        htmlFor={id}
        className="datetime-picker-label"
      >
        {label}
        {required && <span className="datetime-picker-required">*</span>}
      </label>
      <input
        type="datetime-local"
        id={id}
        name={name}
        value={formatToLocalDateTimeString(value)}
        onChange={handleChange}
        className={`datetime-picker-input ${error ? 'error' : ''}`}
        style={{
          colorScheme: 'light',
          caretColor: 'transparent'
        }}
        required={required}
      />
      {error && (
        <p className="datetime-picker-error-message">{error}</p>
      )}
    </div>
  );
}
