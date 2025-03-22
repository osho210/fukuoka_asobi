'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/DatePicker.module.css';

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  formatDate?: (date: Date) => string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  label,
  minDate,
  maxDate,
  placeholder = '日付を選択',
  formatDate = (date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // 月の最初の日と最後の日を取得
  const getMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { firstDay, lastDay };
  };

  // 月のカレンダーデータを生成
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const { firstDay, lastDay } = getMonthDays(year, month);

    // 前月の日を追加
    const daysFromPrevMonth = firstDay.getDay();
    const prevMonthDays = [];
    if (daysFromPrevMonth > 0) {
      const { lastDay: prevMonthLastDay } = getMonthDays(year, month - 1);
      for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        prevMonthDays.push({
          date: new Date(year, month - 1, prevMonthLastDay.getDate() - i),
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          isDisabled: false,
        });
      }
    }

    // 現在の月の日を追加
    const currentMonthDays = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      currentMonthDays.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        isSelected: isSelectedDate(date),
        isDisabled: isDisabledDate(date),
      });
    }

    // 翌月の日を追加
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const daysFromNextMonth = 42 - totalDays; // 6週間分のカレンダーを表示
    const nextMonthDays = [];
    for (let i = 1; i <= daysFromNextMonth; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: false,
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // 今日の日付かどうかをチェック
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 選択された日付かどうかをチェック
  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 無効な日付かどうかをチェック
  const isDisabledDate = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // 前月へ移動
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // 翌月へ移動
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // 日付を選択
  const handleDateSelect = (date: Date) => {
    if (isDisabledDate(date)) return;
    onChange(date);
    setIsOpen(false);
  };

  // 曜日の配列
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // 月の名前
  const getMonthName = (month: number) => {
    return `${month + 1}月`;
  };

  // カレンダーの外側をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={datePickerRef} className={styles.datePickerContainer}>
      {label && <div className={styles.sliderLabel}>{label}</div>}
      <input
        type="text"
        className={styles.datePickerInput}
        value={selectedDate ? formatDate(selectedDate) : ''}
        placeholder={placeholder}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className={styles.datePickerCalendar}>
          <div className={styles.calendarHeader}>
            <button
              type="button"
              className={styles.navButton}
              onClick={goToPrevMonth}
            >
              ←
            </button>
            <div className={styles.monthYearLabel}>
              {`${currentMonth.getFullYear()}年 ${getMonthName(currentMonth.getMonth())}`}
            </div>
            <button
              type="button"
              className={styles.navButton}
              onClick={goToNextMonth}
            >
              →
            </button>
          </div>
          <div className={styles.weekdaysRow}>
            {weekdays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className={styles.daysGrid}>
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`${styles.dayCell} ${
                  day.isSelected ? styles.selectedDay : ''
                } ${day.isToday ? styles.todayDay : ''} ${
                  !day.isCurrentMonth ? styles.outsideDay : ''
                } ${day.isDisabled ? styles.disabledDay : ''}`}
                onClick={() => !day.isDisabled && handleDateSelect(day.date)}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
