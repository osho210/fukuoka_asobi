'use client';
import '@/styles/BusinessHour.css';
import { formatTimeFromIso } from '../lib/dateUtils';

interface BusinessHoursProps {
  spot: {
    openingHours: Array<{
      id: string;
      dayOfWeek: string;
      openTime: string;
      closeTime: string;
      isClosedDay: boolean;
    }>;
  };
}

export default function BusinessHours({ spot }: BusinessHoursProps) {
  // getSpot クエリから返される openingHours を使用
  const openingHours = spot.openingHours;

  if (!openingHours || openingHours.length === 0) {
    return (
      <div className="business-hours">
        <p>営業時間の情報がありません。</p>
      </div>
    );
  }

  return (
    <div className="business-hours">
      <ul className="business-hours-list">
        {openingHours.map((hour) => (
          <li key={hour.id} className="business-hour-item">
            <span className="day-of-week">{hour.dayOfWeek}:</span>
            {hour.isClosedDay ? (
              <span className="hours">定休日</span>
            ) : (
              <span className="hours">{formatTimeFromIso(hour.openTime)} ~ {formatTimeFromIso(hour.closeTime)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
