'use client';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { formatDate } from '../lib/dateUtils';
import '@/styles/EventsPage.css';
import Image from 'next/image';
import { Event } from '@/__generated__/graphql';
import { GET_RECOMMENDED_EVENTS } from '@/graphql/getRecommendedEvents';

type EventListProps = {
  selectedCategoryId?: string | null;
  limit?: number;
  showAll?: boolean;
};

export default function EventList({ selectedCategoryId, limit, showAll = true }: EventListProps) {
  const { data, loading, error } = useQuery<{ events: Event[] }>(GET_RECOMMENDED_EVENTS);

  const events = data?.events ?? [];

  // カテゴリとlimitでフィルタリング・制限する関数型処理
  const filteredEvents = events
    .filter(event => !selectedCategoryId || event.eventCategory?.id === selectedCategoryId)
    .slice(0, !showAll && limit && limit > 0 ? limit : events.length);

  if (loading) return <div className="event-loading-message">読み込み中...</div>;
  if (error) return <div className="event-error-message">イベントの取得に失敗しました</div>;
  if (filteredEvents.length === 0) return <div className="event-empty-message">イベントが見つかりませんでした</div>;

  return (
    <div className="event-list-container">
      <div className="event-list-grid">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <Link href={`/events/${event.id}`}>
              <div className="event-card-image-container">
                {event.bannerImage ? (
                  <Image src={event.bannerImage} alt={event.title} width={300} height={200} layout="responsive" />
                ) : (
                  <div className="event-card-no-image">
                    <span className="event-card-no-image-text">No Image</span>
                  </div>
                )}
                <div className="event-card-category-badge">
                  {event.eventCategory?.name}
                </div>
                {event.isOnline && (
                  <div className="event-card-online-badge">
                    オンライン
                  </div>
                )}
              </div>
              <div className="event-card-content">
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-date">
                  <span className="event-card-icon">📅</span>
                  {formatDate(new Date(event.startDatetime))}
                </p>
                <p className="event-card-location">
                  <span className="event-card-icon"><Image src="/pin-icon.png" alt="Departure Icon" width={20} height={20} /></span>
                  {event.location}
                </p>
                {event.price && (
                  <p className="event-card-price">
                    <span className="event-card-icon">💰</span>
                    {event.price}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
