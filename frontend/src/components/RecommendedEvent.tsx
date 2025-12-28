'use client';

import { useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '../lib/dateUtils';
import '@/styles/RecommendedEvent.css';
import { GET_RECOMMENDED_EVENTS, GetRecommendedEventsQuery } from '@/graphql/getRecommendedEvents';

const RecommendedEvent = () => {
  const { loading, error, data } = useQuery<GetRecommendedEventsQuery>(GET_RECOMMENDED_EVENTS);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data || !data.events || data.events.length === 0) return <p className='noContentFound'>おすすめイベントが見つかりません</p>;

  return (
    <div className="recommended-events">
      <div className="events-grid">
        {data.events.slice(0, 3).map((event) => (
          <Link href={`/events/${event.id}`} key={event.id} className="event-card">
            <div className="event-image">
              {event.bannerImage ? (
                <Image
                  src={event.bannerImage.startsWith('http') ? event.bannerImage : `/${event.bannerImage}`}
                  alt={event.title}
                  width={300}
                  height={200}
                  className="event-thumbnail"
                />
              ) : (
                <div className="image-placeholder">
                  <span>No Image</span>
                </div>
              )}
              <div className="event-category-badge">{event.eventCategory?.name}</div>
              {event.isOnline && (
                <div className="event-online-badge">オンライン</div>
              )}
            </div>
            <div className="event-content">
              <h3 className="event-name">{event.title}</h3>
              <div className="event-meta">
                <span className="event-date">
                  <i className="event-icon">📅</i> {formatDate(new Date(event.startDatetime))}
                </span>
                <span className="event-location">
                  <i className="event-icon">📍</i> {event.location}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedEvent;
