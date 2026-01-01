'use client';

import '@/styles/datetime-picker.css';

interface TimePickerProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    error?: string;
    fullWidth?: boolean;
}

export function TimePicker({
    id,
    name,
    label,
    value,
    onChange,
    required = false,
    error,
    fullWidth = false,
}: TimePickerProps) {
    // ISO8601形式の日付文字列から時刻のみを抽出（HH:mm形式）
    const formatToTimeString = (isoString: string): string => {
        if (!isoString) return '';

        try {
            // ISO8601形式の日付文字列をDateオブジェクトに変換
            const date = new Date(isoString);

            // 無効な日付の場合は空文字列を返す
            if (isNaN(date.getTime())) return '';

            // HH:mm形式に変換（time入力用）
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${hours}:${minutes}`;
        } catch (e) {
            console.error('時刻変換エラー:', e);
            return '';
        }
    };

    // HTML time形式（HH:mm）からISO8601形式に変換
    const formatToISOString = (timeString: string): string => {
        if (!timeString) return '';

        try {
            // time入力値（HH:mm）を解析
            const [hours, minutes] = timeString.split(':').map(Number);

            // 1970-01-01 を基準日として ISO8601 形式で返す
            // データベースは時刻のみを保存するため、基準日は任意
            const date = new Date(1970, 0, 1, hours, minutes, 0, 0);

            // ISO8601形式に変換
            return date.toISOString();
        } catch (e) {
            console.error('時刻変換エラー:', e);
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

        // HTML time形式からISO8601形式に変換
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
                type="time"
                id={id}
                name={name}
                value={formatToTimeString(value)}
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
