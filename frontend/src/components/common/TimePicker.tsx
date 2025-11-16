'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@/styles/TimePicker.css';

interface TimePickerProps {
  selectedTime: string | null;
  onChange: (time: string) => void;
  label?: string;
  placeholder?: string;
  interval?: number; // 分単位の間隔（例：30分間隔なら30）
  startTime?: string; // 開始時間（例：'09:00'）
  endTime?: string; // 終了時間（例：'21:00'）
}

const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  onChange,
  label,
  placeholder = '時間を選択',
  interval = 30,
  startTime = '00:00',
  endTime = '23:30',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // 時間オプションを生成
  const generateTimeOptions = () => {
    const options: string[] = [];

    // 開始時間と終了時間を分に変換
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // 指定された間隔で時間オプションを生成
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;

      // 時間と分を2桁の文字列に変換
      const hourStr = hour.toString().padStart(2, '0');
      const minuteStr = minute.toString().padStart(2, '0');

      options.push(`${hourStr}:${minuteStr}`);
    }

    return options;
  };

  // 時間オプションをクリックしたときの処理
  const handleTimeSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  // カレンダーの外側をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const timeOptions = generateTimeOptions();

  return (
    <div ref={timePickerRef} className="timePickerContainer">
      {label && <div className="timePickerLabel">{label}</div>}
      <input
        type="text"
        className="timePickerInput"
        value={selectedTime || ''}
        placeholder={placeholder}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="timePickerDropdown">
          {timeOptions.map((time) => (
            <div
              key={time}
              className={`timeOption ${
                selectedTime === time ? "selectedTime" : ''
              }`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimePicker;
