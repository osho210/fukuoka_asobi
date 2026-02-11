'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatDateRange } from '../lib/dateUtils';
import '@/styles/EventsPage.css';
import { Event } from '@/__generated__/graphql';

type EventDetailProps = {
  eventId: string;
};

export default function EventDetail({ eventId }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // 実際のGraphQLクエリを実行する処理
        // ここではダミーデータを使用
        const dummyEvent: Event = {
          id: '1',
          title: '福岡クラフトビアフェスティバル',
          description: '福岡市内外のクラフトビールブルワリーが集結する九州最大級のビールイベント。様々な種類のクラフトビールを楽しめるほか、フードブースも充実。地元のブルワリーとの交流や、ビールに合う料理の提案など、ビール好きにはたまらないイベントです。',
          location: '福岡市中央区天神 天神中央公園',
          latitude: 33.5917,
          longitude: 130.3971,
          startDatetime: '2025-04-01T10:00:00Z',
          endDatetime: '2025-04-03T18:00:00Z',
          recurringRule: null,
          price: '入場無料（飲食は有料）',
          organizer: '福岡クラフトビール協会',
          contactEmail: 'info@fukuoka-beer.jp',
          contactPhone: '092-123-4567',
          capacity: 5000,
          isOnline: false,
          sourceUrl: 'itoshima.png',
          bannerImage: '',
          eventCategory: {
            id: '1',
            name: 'フェス・マーケット',
            createdAt: undefined,
            updatedAt: undefined
          },
          createdAt: undefined,
          eventCategoryId: 0,
          updatedAt: undefined
        };

        // 実際のAPIでは、eventIdを使用して特定のイベントを取得
        setEvent(dummyEvent);
        setLoading(false);
      } catch (err) {
        setError('イベント情報の取得に失敗しました');
        setLoading(false);
        console.error('イベント取得エラー:', err);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) return <div className="event-detail-loading">読み込み中...</div>;
  if (error) return <div className="event-detail-error">{error}</div>;
  if (!event) return <div className="event-detail-not-found">イベントが見つかりませんでした</div>;

  return (
    <div className="event-detail-container">
      {/* イベントヘッダー */}
      <div className="event-detail-header">
        <div className="event-detail-banner">
          {event.bannerImage ? (
            <Image src={event.bannerImage} alt={event.title} width={300} height={200} layout="responsive" />
          ) : (
            <div className="event-detail-no-image">
              <span className="image-placeholder">No Image</span>
            </div>
          )}
        </div>
        <div className="event-detail-badges">
          <span className="event-detail-category-badge">
            {event.eventCategory.name}
          </span>
          {event.isOnline && (
            <span className="event-detail-online-badge">
              オンライン
            </span>
          )}
        </div>
      </div>

      {/* イベント情報 */}
      <div className="event-detail-content">
        <h1 className="event-detail-title">{event.title}</h1>

        <div className="event-detail-grid">
          {/* 左カラム: 基本情報 */}
          <div className="event-detail-main">
            <div className="event-detail-section">
              <h2 className="event-detail-section-title">イベント詳細</h2>
              <p className="event-detail-description">{event.description}</p>
            </div>

            <div className="event-detail-section">
              <h2 className="event-detail-section-title">開催日時</h2>
              <p className="event-detail-datetime">
                <span className="event-detail-icon">📅</span>
                {formatDateRange(new Date(event.startDatetime), new Date(event.endDatetime))}
              </p>
              {event.recurringRule && (
                <p className="event-detail-recurring">
                  繰り返し: {event.recurringRule}
                </p>
              )}
            </div>

            <div className="event-detail-section">
              <h2 className="event-detail-section-title">開催場所</h2>
              <p className="event-detail-location">
                <span className="event-detail-icon"><Image src="/pin-icon.png" alt="Departure Icon" width={20} height={20} /></span>
                {event.location}
              </p>
              {(event.latitude && event.longitude) && (
                <div className="event-detail-map-container">
                  {/* ここに地図を表示 */}
                  <div className="event-detail-map-placeholder">
                    <span className="event-detail-map-text">地図が表示されます</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右カラム: サイドバー情報 */}
          <div className="event-detail-sidebar">
            <div className="event-detail-sidebar-content">
              {event.price && (
                <div className="event-detail-sidebar-item">
                  <h3 className="event-detail-sidebar-label">料金</h3>
                  <p>{event.price}</p>
                </div>
              )}

              {event.capacity && (
                <div className="event-detail-sidebar-item">
                  <h3 className="event-detail-sidebar-label">定員</h3>
                  <p>{event.capacity}人</p>
                </div>
              )}

              {event.organizer && (
                <div className="event-detail-sidebar-item">
                  <h3 className="event-detail-sidebar-label">主催者</h3>
                  <p>{event.organizer}</p>
                </div>
              )}

              <div className="event-detail-sidebar-item">
                <h3 className="event-detail-sidebar-label">お問い合わせ</h3>
                {event.contactEmail && (
                  <p className="event-detail-contact">
                    <span className="event-detail-icon">✉️</span>
                    <a href={`mailto:${event.contactEmail}`} className="event-detail-link">
                      {event.contactEmail}
                    </a>
                  </p>
                )}
                {event.contactPhone && (
                  <p className="event-detail-contact">
                    <span className="event-detail-icon">📞</span>
                    <a href={`tel:${event.contactPhone}`} className="event-detail-link">
                      {event.contactPhone}
                    </a>
                  </p>
                )}
              </div>

              {event.sourceUrl && (
                <div className="event-detail-sidebar-item">
                  <h3 className="event-detail-sidebar-label">公式サイト</h3>
                  <a
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-detail-external-link"
                  >
                    <span className="event-detail-icon">🔗</span>
                    公式サイトを見る
                  </a>
                </div>
              )}
            </div>
            <div className="event-detail-buttons">
              <button className="event-detail-share-button">
                シェアする
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
