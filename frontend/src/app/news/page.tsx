'use client';

import NewsCard from '@/components/NewsCard';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NEWS_LIST } from '@/graphql/queries/getNewsList';
import { GetNewsListQuery } from '@/__generated__/types';
import '@/styles/NewsPage.css';

export default function NewsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { loading, error, data } = useQuery<GetNewsListQuery>(GET_NEWS_LIST, {
    variables: {
      categoryId: selectedCategoryId,
      limit: 20
    },
  });

  if (loading) return <div className="news-loading-container">読み込み中...</div>;
  if (error) return <div className="news-error-container">エラーが発生しました</div>;

  const news = data?.news || [];
  const categories = data?.categories || [];

  // 選択されたカテゴリ名を取得
  const selectedCategoryName = selectedCategoryId
    ? categories.find(c => c.id === selectedCategoryId)?.name
    : null;

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="news-container">
      <h1 className="news-heading">ニュース</h1>

      {/* カテゴリーフィルター */}
      <div className="news-category-filter">
        <h2 className="news-category-heading">カテゴリー</h2>

        {/* モバイル用ドロップダウン */}
        <div className="news-category-dropdown-wrapper">
          <button
            className="news-category-dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="news-category-dropdown-label">
              {selectedCategoryName || 'すべてのカテゴリ'}
            </span>
            <span className="news-category-dropdown-arrow">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="news-category-dropdown-menu" role="listbox">
              <button
                key="all"
                className={`news-category-dropdown-item ${selectedCategoryId === null ? 'news-category-dropdown-item-active' : ''}`}
                onClick={() => handleSelectCategory(null)}
                role="option"
                aria-selected={selectedCategoryId === null}
              >
                すべて
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`news-category-dropdown-item ${selectedCategoryId === category.id ? 'news-category-dropdown-item-active' : ''}`}
                  onClick={() => handleSelectCategory(category.id)}
                  role="option"
                  aria-selected={selectedCategoryId === category.id}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* デスクトップ用ボタングループ */}
        <div className="news-category-buttons-desktop">
          <button
            className={`news-category-button ${selectedCategoryId === null ? 'news-category-button-active' : ''}`}
            onClick={() => setSelectedCategoryId(null)}
          >
            すべて
          </button>
          {categories.map((category) => (
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
          {news.map((item) => (
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
