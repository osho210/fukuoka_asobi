import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '../lib/dateUtils';

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDatetime: string;
  endDatetime: string;
  price: string | null;
  bannerImage: string | null;
  isOnline: boolean;
  status: string;
  eventCategory: {
    id: string;
    name: string;
  };
};

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
            bannerImage: 'https://example.com/images/beer-festival.jpg',
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
            bannerImage: 'https://example.com/images/itoshima-market.jpg',
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
            bannerImage: 'https://example.com/images/art-week.jpg',
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
            bannerImage: 'https://example.com/images/hakata-dolls.jpg',
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

  if (loading) return <div className="text-center py-8">読み込み中...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (events.length === 0) return <div className="text-center py-8">イベントが見つかりませんでした</div>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/events/${event.id}`}>
              <div className="relative h-48 bg-gray-200">
                {event.bannerImage ? (
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {event.eventCategory.name}
                </div>
                {event.isOnline && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    オンライン
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="inline-block mr-1">📅</span>
                  {formatDate(new Date(event.startDatetime))}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="inline-block mr-1">📍</span>
                  {event.location}
                </p>
                {event.price && (
                  <p className="text-sm text-gray-600">
                    <span className="inline-block mr-1">💰</span>
                    {event.price}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {!showAll && events.length >= limit && (
        <div className="text-center mt-8">
          <Link href="/events" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            すべてのイベントを見る
          </Link>
        </div>
      )}
    </div>
  );
}
