'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (categories.length === 0) return <div className="text-center py-4">カテゴリが見つかりませんでした</div>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">イベントカテゴリ</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/events/categories/${category.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
