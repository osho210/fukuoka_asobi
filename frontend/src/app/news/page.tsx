'use client';

import NewsCard from '@/components/NewsCard';
import { useState } from 'react';

// GraphQLの型定義が生成されるまでの仮の型定義
type Category = {
  id: string;
  name: string;
};

type Author = {
  id: string;
  username: string;
  profileImageUrl?: string | null;
};

type NewsItem = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  status: string;
  imageUrl?: string | null;
  category?: Category | null;
  author?: Author | null;
  createdAt: string;
  updatedAt: string;
};

export default function NewsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // 仮のデータ
  const loading = false;
  const error = null;
  const data = {
    news: [
      {
        id: '1',
        title: '福岡の新しい観光スポット「福岡タワーパーク」がオープン',
        body: '福岡市中央区に新しい観光スポット「福岡タワーパーク」がオープンしました。広大な敷地内には、遊具やカフェ、イベントスペースなどが設置され、家族連れやカップルに人気のスポットとなっています。',
        publishedAt: new Date().toISOString(),
        status: 'published',
        imageUrl: 'itoshima.png',
        category: { id: '1', name: 'イベント' },
        author: { id: '1', username: '管理者' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: '福岡グルメフェスティバル2025の開催が決定',
        body: '福岡の食文化を楽しめる「福岡グルメフェスティバル2025」の開催が決定しました。来年5月に福岡市博多区の福岡国際センターで3日間にわたり開催されます。',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        imageUrl: 'itoshima.png',
        category: { id: '2', name: 'グルメ' },
        author: { id: '2', username: '編集部' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: '福岡市内の公園でナイトピクニックイベントを開催',
        body: '福岡市内の主要公園で、夜の公園を楽しむ「ナイトピクニック」イベントが今月末から開催されます。大濠公園、舞鶴公園など市内5カ所の公園で順次開催され、ライトアップされた公園でピクニックを楽しむことができます。',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        imageUrl: 'itoshima.png',
        category: { id: '1', name: 'イベント' },
        author: { id: '1', username: '管理者' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    categories: [
      { id: '1', name: 'イベント' },
      { id: '2', name: 'グルメ' },
      { id: '3', name: '観光' },
      { id: '4', name: 'ショッピング' }
    ]
  };

  if (loading) return <div className="news-loading-container">読み込み中...</div>;
  if (error) return <div className="news-error-container">エラーが発生しました</div>;

  const news = data?.news || [];

  return (
    <div className="news-container">
      <h1 className="news-heading">ニュース</h1>

      {/* カテゴリーフィルター */}
      <div className="news-category-filter">
        <h2 className="news-category-heading">カテゴリー</h2>
        <div className="news-category-buttons">
          <button
            className={`news-category-button ${selectedCategoryId === null ? 'news-category-button-active' : ''}`}
            onClick={() => setSelectedCategoryId(null)}
          >
            すべて
          </button>
          {data?.categories?.map((category: Category) => (
            <button
              key={category.id}
              className={`news-category-button ${selectedCategoryId === category.id ? 'news-category-button-active' : ''}`}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* ニュース一覧 */}
      {news.length === 0 ? (
        <div className="news-empty-container">
          <p className="news-empty-message">ニュースがありません</p>
        </div>
      ) : (
        <div className="news-grid">
          {news.map((item: NewsItem) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              body={item.body}
              publishedAt={item.publishedAt}
              imageUrl={item.imageUrl}
              categoryName={item.category?.name}
              authorName={item.author?.username}
            />
          ))}
        </div>
      )}
    </div>
  );
}
