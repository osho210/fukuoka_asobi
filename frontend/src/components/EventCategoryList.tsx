'use client';

import '@/styles/EventsPage.css';
import { EventCategory } from '@/__generated__/graphql';
import { useState } from 'react';

interface EventCategoryListProps {
  categories: EventCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function EventCategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory
}: EventCategoryListProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!categories || categories.length === 0) {
    return <div className="event-category-empty">カテゴリが見つかりませんでした</div>;
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
    <div className="event-category-container">
      <h2 className="event-category-heading">イベントカテゴリ</h2>

      {/* モバイル用ドロップダウン */}
      <div className="event-category-dropdown-wrapper">
        <button
          className="event-category-dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="event-category-dropdown-label">
            {selectedCategoryName || 'すべてのカテゴリ'}
          </span>
          <span className="event-category-dropdown-arrow">▼</span>
        </button>

        {isDropdownOpen && (
          <div className="event-category-dropdown-menu" role="listbox">
            <button
              key="all"
              className={`event-category-dropdown-item ${selectedCategoryId === null ? 'event-category-dropdown-item-active' : ''}`}
              onClick={() => handleSelectCategory(null)}
              role="option"
              aria-selected={selectedCategoryId === null}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`event-category-dropdown-item ${selectedCategoryId === category.id ? 'event-category-dropdown-item-active' : ''}`}
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
      <div className="event-category-buttons-desktop">
        <button
          className={`event-category-button ${selectedCategoryId === null ? 'event-category-button-active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          すべて
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`event-category-button ${selectedCategoryId === category.id ? 'event-category-button-active' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
