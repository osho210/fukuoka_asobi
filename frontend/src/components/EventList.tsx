'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '../lib/dateUtils';
import '@styles/EventsPage.css';
import Image from 'next/image';
import { Event } from '@/__generated__/graphql';

type EventListProps = {
  categoryId?: string;
  limit?: number;
  upcoming?: boolean;
  showAll?: boolean;
};

export default function EventList({ categoryId, limit = 4, upcoming = true, showAll = false }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // 実際のGraphQLクエリを実行する処理
        // ここではダミーデータを使用
        const dummyEvents: Event[] = [
          {
            id: '1',
            title: '福岡クラフトビアフェスティバル',
            description: '福岡市内外のクラフトビールブルワリーが集結する九州最大級のビールイベント。',
            location: '福岡市中央区天神 天神中央公園',
            startDatetime: '2025-04-01T10:00:00Z',
            endDatetime: '2025-04-03T18:00:00Z',
            price: '入場無料（飲食は有料）',
            bannerImage: '',
            isOnline: false,
            status: 'PUBLISHED',
            eventCategory: {
              id: '1',
              name: 'フェス・マーケット'
            }
          },
          {
            id: '2',
            title: '糸島ファーマーズマーケット',
            description: '糸島の新鮮な農産物や海産物、加工品などを販売する定期市。',
            location: '糸島市二丈福井 ファームパーク伊都国',
            startDatetime: '2025-03-25T09:00:00Z',
            endDatetime: '2025-03-25T17:00:00Z',
            price: '入場無料',
            bannerImage: '',
            isOnline: false,
            status: 'PUBLISHED',
            eventCategory: {
              id: '1',
              name: 'フェス・マーケット'
            }
          },
          {
            id: '3',
            title: '福岡アートウィーク',
            description: '福岡市内の美術館やギャラリーが連携して開催する芸術週間。',
            location: '福岡市内各所',
            startDatetime: '2025-04-15T10:00:00Z',
            endDatetime: '2025-04-22T18:00:00Z',
            price: '会場により異なる',
            bannerImage: '',
            isOnline: false,
            status: 'PUBLISHED',
            eventCategory: {
              id: '2',
              name: '展示会・ギャラリー'
            }
          },
          {
            id: '4',
            title: '博多人形絵付け体験',
            description: '伝統工芸品である博多人形の絵付け体験ができるワークショップ。',
            location: '福岡市博多区冷泉町 博多伝統工芸館',
            startDatetime: '2025-03-20T13:00:00Z',
            endDatetime: '2025-03-20T16:00:00Z',
            price: '3,000円（材料費込み）',
            bannerImage: '',
            isOnline: false,
            status: 'PUBLISHED',
            eventCategory: {
              id: '3',
              name: 'ワークショップ'
            }
          }
        ];

        // カテゴリでフィルタリング
        let filteredEvents = dummyEvents;
        if (categoryId) {
          filteredEvents = dummyEvents.filter(event => event.eventCategory.id === categoryId);
        }

        // 表示件数制限
        if (!showAll && filteredEvents.length > limit) {
          filteredEvents = filteredEvents.slice(0, limit);
        }

        setEvents(filteredEvents);
        setLoading(false);
      } catch (err) {
        setError('イベントの取得に失敗しました');
        setLoading(false);
        console.error('イベント取得エラー:', err);
      }
    };

    fetchEvents();
  }, [categoryId, limit, upcoming, showAll]);

  if (loading) return <div className="event-loading-message">読み込み中...</div>;
  if (error) return <div className="event-error-message">{error}</div>;
  if (events.length === 0) return <div className="event-empty-message">イベントが見つかりませんでした</div>;

  return (
    <div className="event-list-container">
      <div className="event-list-grid">
        {events.map((event) => (
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
                  {event.eventCategory.name}
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
                  <span className="event-card-icon">📍</span>
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

      {!showAll && events.length >= limit && (
        <div className="event-list-more-link-container">
          <Link href="/events" className="event-list-more-link">
            すべてのイベントを見る
          </Link>
        </div>
      )}
    </div>
  );
}
