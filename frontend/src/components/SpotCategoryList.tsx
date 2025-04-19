'use client';
import '@styles/SpotsPage.css';

type SpotCategory = {
  id: string;
  name: string;
  description?: string | null;
};

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
  if (!categories || categories.length === 0) {
    return <div className="spot-category-empty">カテゴリが見つかりませんでした</div>;
  }

  return (
    <div className="spot-category-container">
      <h2 className="spot-category-heading">スポットカテゴリ</h2>
      <div className="spot-category-buttons">
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
