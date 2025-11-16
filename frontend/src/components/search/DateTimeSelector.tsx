'use client';

import React from 'react';
import DatePicker from '@/components/common/DatePicker';
import TimePicker from '@/components/common/TimePicker';
import '@/styles/SearchForm.css';

interface DateTimeSelectorProps {
  date: string;
  startTime?: string;
  endTime?: string;
  onChange: (date: string, startTime: string, endTime: string) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  date,
  startTime,
  endTime,
  onChange,
}) => {
  // 日付選択時の処理
  const handleDateChange = (selectedDate: Date) => {
    const formattedDate = formatDate(selectedDate);
    onChange(formattedDate, startTime || '', endTime || '');
  };

  // 開始時間選択時の処理
  const handleStartTimeChange = (time: string) => {
    onChange(date, time, endTime || '');
  };

  // 終了時間選択時の処理
  const handleEndTimeChange = (time: string) => {
    onChange(date, startTime || '', time);
  };

  // 日付をYYYY-MM-DD形式に変換
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 文字列の日付をDateオブジェクトに変換
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <div className="formSection">
      <h2 className="sectionTitle">日時を選択</h2>

      <div className="formGroup">
        <label className="formLabel">訪問予定日</label>
        <DatePicker
          selectedDate={parseDate(date)}
          onChange={handleDateChange}
          minDate={new Date()} // 今日以降の日付のみ選択可能
        />
      </div>

      <div className="formRow">
        <div className="formColumn">
          <label className="formLabel">開始時間</label>
          <TimePicker
            selectedTime={startTime || null}
            onChange={handleStartTimeChange}
            interval={30}
            startTime="09:00"
            endTime="21:00"
          />
        </div>

        <div className="formColumn">
          <label className="formLabel">終了時間</label>
          <TimePicker
            selectedTime={endTime || null}
            onChange={handleEndTimeChange}
            interval={30}
            startTime="09:00"
            endTime="23:30"
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;
