'use client';

import NewsCard from '@/components/NewsCard';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NEWS_LIST } from '@/graphql/queries/getNewsList';
import { GetNewsListQuery } from '@/__generated__/types';
import '@styles/NewsPage.css';

export default function NewsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { loading, error, data } = useQuery<GetNewsListQuery>(GET_NEWS_LIST, {
    variables: {
      categoryId: selectedCategoryId,
      limit: 20
    },
  });

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
          {data?.categories?.map((category) => (
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
          {news.map((item: News) => (
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
