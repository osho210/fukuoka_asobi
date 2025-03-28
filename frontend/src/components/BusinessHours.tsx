'use client';
import '@styles/BusinessHour.css';

interface OpeningHourList {
  dayOfWeek: string;
  businessHour: string;
}

interface BusinessHoursProps {
  spot: {
    openingHourList?: OpeningHourList[] | null;
  };
}

export default function BusinessHours({ spot }: BusinessHoursProps) {
  if (!spot.openingHourList || spot.openingHourList.length === 0) {
    return (
      <div className="business-hours">
        <h3>営業時間</h3>
        <p>営業時間の情報がありません。</p>
      </div>
    );
  }

  return (
    <div className="business-hours">
      <p>営業時間</p>
      <ul className="business-hours-list">
        {spot.openingHourList.map((hour, index) => (
          <li key={index} className="business-hour-item">
            <span className="day-of-week">{hour.dayOfWeek}:</span>
            <span className="hours">{hour.businessHour}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
