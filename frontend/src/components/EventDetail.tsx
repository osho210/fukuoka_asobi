'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDateRange } from '../lib/dateUtils';

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  startDatetime: string;
  endDatetime: string;
  recurringRule: string | null;
  price: string | null;
  organizer: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  capacity: number | null;
  isOnline: boolean;
  sourceUrl: string | null;
  bannerImage: string | null;
  eventCategory: {
    id: string;
    name: string;
  };
};

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
          bannerImage: 'https://example.com/images/beer-festival.jpg',
          eventCategory: {
            id: '1',
            name: 'フェス・マーケット'
          }
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

  if (loading) return <div className="text-center py-8">読み込み中...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!event) return <div className="text-center py-8">イベントが見つかりませんでした</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* イベントヘッダー */}
      <div className="relative">
        <div className="h-64 bg-gray-200">
          {event.bannerImage ? (
            <Image src={event.bannerImage} alt={event.title} width={300} height={200} layout="responsive" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-xl">No Image</span>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {event.eventCategory.name}
          </span>
          {event.isOnline && (
            <span className="ml-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              オンライン
            </span>
          )}
        </div>
      </div>

      {/* イベント情報 */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 左カラム: 基本情報 */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">イベント詳細</h2>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">開催日時</h2>
              <p className="flex items-center">
                <span className="inline-block mr-2">📅</span>
                {formatDateRange(new Date(event.startDatetime), new Date(event.endDatetime))}
              </p>
              {event.recurringRule && (
                <p className="text-sm text-gray-600 mt-1">
                  繰り返し: {event.recurringRule}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">開催場所</h2>
              <p className="flex items-center">
                <span className="inline-block mr-2">📍</span>
                {event.location}
              </p>
              {(event.latitude && event.longitude) && (
                <div className="mt-2 h-48 bg-gray-200 rounded">
                  {/* ここに地図を表示 */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">地図が表示されます</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右カラム: サイドバー情報 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-4">
              {event.price && (
                <div>
                  <h3 className="font-semibold text-gray-700">料金</h3>
                  <p>{event.price}</p>
                </div>
              )}

              {event.capacity && (
                <div>
                  <h3 className="font-semibold text-gray-700">定員</h3>
                  <p>{event.capacity}人</p>
                </div>
              )}

              {event.organizer && (
                <div>
                  <h3 className="font-semibold text-gray-700">主催者</h3>
                  <p>{event.organizer}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-700">お問い合わせ</h3>
                {event.contactEmail && (
                  <p className="flex items-center">
                    <span className="inline-block mr-2">✉️</span>
                    <a href={`mailto:${event.contactEmail}`} className="text-blue-500 hover:underline">
                      {event.contactEmail}
                    </a>
                  </p>
                )}
                {event.contactPhone && (
                  <p className="flex items-center">
                    <span className="inline-block mr-2">📞</span>
                    <a href={`tel:${event.contactPhone}`} className="text-blue-500 hover:underline">
                      {event.contactPhone}
                    </a>
                  </p>
                )}
              </div>

              {event.sourceUrl && (
                <div>
                  <h3 className="font-semibold text-gray-700">公式サイト</h3>
                  <a
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <span className="inline-block mr-2">🔗</span>
                    公式サイトを見る
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link href="/events" className="text-blue-500 hover:underline">
              ← イベント一覧に戻る
            </Link>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                お気に入りに追加
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                シェアする
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
