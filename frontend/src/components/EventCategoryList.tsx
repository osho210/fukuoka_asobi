'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/EventsPage.css';

type EventCategory = {
  id: string;
  name: string;
  description: string | null;
};

export default function EventCategoryList() {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // 実際のGraphQLクエリを実行する処理
        // ここではダミーデータを使用
        const dummyCategories: EventCategory[] = [
          {
            id: '1',
            name: 'フェス・マーケット',
            description: '音楽フェスティバル、マルシェ、フリーマーケットなど'
          },
          {
            id: '2',
            name: '展示会・ギャラリー',
            description: 'アート展示会、写真展、ギャラリーイベントなど'
          },
          {
            id: '3',
            name: 'ワークショップ',
            description: '各種ワークショップ、体験イベント、ハンドメイド教室など'
          },
          {
            id: '4',
            name: 'スポーツ・アウトドア',
            description: 'スポーツイベント、アウトドアアクティビティ、ヨガなど'
          },
          {
            id: '5',
            name: 'グルメ・フード',
            description: 'グルメフェス、飲食イベント、料理教室など'
          },
          {
            id: '6',
            name: '伝統・文化',
            description: '祭り、伝統行事、文化イベントなど'
          },
          {
            id: '7',
            name: 'セミナー・講演会',
            description: '各種セミナー、講演会、勉強会など'
          },
          {
            id: '8',
            name: 'その他',
            description: 'その他のイベント'
          }
        ];

        setCategories(dummyCategories);
        setLoading(false);
      } catch (err) {
        setError('カテゴリの取得に失敗しました');
        setLoading(false);
        console.error('カテゴリ取得エラー:', err);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="event-category-loading">読み込み中...</div>;
  if (error) return <div className="event-category-error">{error}</div>;
  if (categories.length === 0) return <div className="event-category-empty">カテゴリが見つかりませんでした</div>;

  return (
    <div className="event-category-container">
      <h2 className="event-category-heading">イベントカテゴリ</h2>
      <div className="event-category-grid">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/events/categories/${category.id}`}
            className="event-category-card"
          >
            <div className="event-category-card-content">
              <h3 className="event-category-card-title">{category.name}</h3>
              {category.description && (
                <p className="event-category-card-description">{category.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
