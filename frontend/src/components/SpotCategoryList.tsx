'use client';
import '@/styles/SpotsPage.css';
import { Category } from '@/__generated__/graphql';
import { useState } from 'react';

type SpotCategory = Category;

interface SpotCategoryListProps {
  categories: SpotCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function SpotCategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory
}: SpotCategoryListProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!categories || categories.length === 0) {
    return <div className="spot-category-empty">カテゴリが見つかりませんでした</div>;
  }

  // 選択されたカテゴリ名を取得
  const selectedCategoryName = selectedCategoryId
    ? categories.find(c => c.id === selectedCategoryId)?.name
    : null;

  const handleSelectCategory = (categoryId: string | null) => {
    onSelectCategory(categoryId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="spot-category-container">
      <h2 className="spot-category-heading">スポットカテゴリ</h2>

      {/* モバイル用ドロップダウン */}
      <div className="spot-category-dropdown-wrapper">
        <button
          className="spot-category-dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="spot-category-dropdown-label">
            {selectedCategoryName || 'すべてのカテゴリ'}
          </span>
          <span className="spot-category-dropdown-arrow">▼</span>
        </button>

        {isDropdownOpen && (
          <div className="spot-category-dropdown-menu" role="listbox">
            <button
              key="all"
              className={`spot-category-dropdown-item ${selectedCategoryId === null ? 'spot-category-dropdown-item-active' : ''}`}
              onClick={() => handleSelectCategory(null)}
              role="option"
              aria-selected={selectedCategoryId === null}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`spot-category-dropdown-item ${selectedCategoryId === category.id ? 'spot-category-dropdown-item-active' : ''}`}
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
      <div className="spot-category-buttons-desktop">
        <button
          className={`spot-category-button ${selectedCategoryId === null ? 'spot-category-button-active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          すべて
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`spot-category-button ${selectedCategoryId === category.id ? 'spot-category-button-active' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
