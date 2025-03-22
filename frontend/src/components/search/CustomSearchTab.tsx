'use client';

import React from 'react';
import { SearchParams, CustomOptions } from '@/types/search';
import styles from '@/styles/SearchForm.module.css';

interface CustomSearchTabProps {
  searchParams: SearchParams;
  updateSearchParams: (updates: Partial<SearchParams>) => void;
}

// 移動手段の選択肢
const transportationOptions = [
  { id: 'walk', label: '徒歩' },
  { id: 'train', label: '電車' },
  { id: 'car', label: '車' },
  { id: 'bicycle', label: '自転車' },
  { id: 'other', label: 'その他' },
];

// テーマの選択肢
const themeOptions = [
  { id: 'healing', label: '癒しの旅' },
  { id: 'active', label: 'アクティブ' },
  { id: 'costeffective', label: 'コスパ' },
  { id: 'gourmet', label: 'グルメ' },
  { id: 'nature', label: '自然' },
  { id: 'culture', label: '文化と歴史' },
];

// カテゴリーの選択肢
const categoryOptions = [
  { id: 'onsen', label: '温泉' },
  { id: 'museum', label: '美術館' },
  { id: 'izakaya', label: '居酒屋' },
  { id: 'roadstation', label: '道の駅' },
  { id: 'experience', label: '体験' },
  { id: 'scenery', label: '絶景' },
  { id: 'cafe', label: 'カフェ' },
  { id: 'shopping', label: 'ショッピング' },
  { id: 'park', label: '公園' },
  { id: 'shrine', label: '神社・寺' },
];

const CustomSearchTab: React.FC<CustomSearchTabProps> = ({
  searchParams,
  updateSearchParams,
}) => {
  // カスタムオプションの更新
  const updateCustomOptions = (updates: Partial<CustomOptions>) => {
    updateSearchParams({
      customOptions: {
        ...searchParams.customOptions,
        ...updates,
      },
    });
  };

  // 移動手段の更新
  const handleTransportationChange = (method: string) => {
    updateCustomOptions({ transportationMethod: method });
  };

  // テーマの更新
  const handleThemeChange = (theme: string) => {
    updateCustomOptions({ theme });
  };

  // 雨天対応の更新
  const handleRainyDayOptionChange = (checked: boolean) => {
    updateCustomOptions({ rainyDayOption: checked });
  };

  // イベント含むの更新
  const handleIncludeEventsChange = (checked: boolean) => {
    updateCustomOptions({ includeEvents: checked });
  };

  // 出発地点の更新
  const handleStartingPointChange = (point: string) => {
    updateCustomOptions({ startingPoint: point });
  };

  // スポット数の更新
  const handleSpotCountChange = (count: number) => {
    updateCustomOptions({ spotCount: count });
  };

  // カテゴリーの更新
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategories = searchParams.customOptions?.categories || [];

    let newCategories: string[];
    if (checked) {
      // カテゴリーを追加
      newCategories = [...currentCategories, categoryId];
    } else {
      // カテゴリーを削除
      newCategories = currentCategories.filter((id) => id !== categoryId);
    }

    updateCustomOptions({ categories: newCategories });
  };

  // カテゴリーが選択されているかチェック
  const isCategorySelected = (categoryId: string): boolean => {
    return searchParams.customOptions?.categories?.includes(categoryId) || false;
  };

  return (
    <div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>移動手段</label>
        <div className={styles.radioGroup}>
          {transportationOptions.map((option) => (
            <div key={option.id} className={styles.radio}>
              <input
                type="radio"
                id={`transportation-${option.id}`}
                name="transportation"
                className={styles.radioInput}
                checked={searchParams.customOptions?.transportationMethod === option.id}
                onChange={() => handleTransportationChange(option.id)}
              />
              <label htmlFor={`transportation-${option.id}`}>{option.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>テーマ</label>
        <div className={styles.radioGroup}>
          {themeOptions.map((option) => (
            <div key={option.id} className={styles.radio}>
              <input
                type="radio"
                id={`theme-${option.id}`}
                name="theme"
                className={styles.radioInput}
                checked={searchParams.customOptions?.theme === option.id}
                onChange={() => handleThemeChange(option.id)}
              />
              <label htmlFor={`theme-${option.id}`}>{option.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="rainyDayOption"
              className={styles.checkboxInput}
              checked={searchParams.customOptions?.rainyDayOption || false}
              onChange={(e) => handleRainyDayOptionChange(e.target.checked)}
            />
            <label htmlFor="rainyDayOption">雨天でも楽しめるプラン</label>
          </div>
        </div>

        <div className={styles.formColumn}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="includeEvents"
              className={styles.checkboxInput}
              checked={searchParams.customOptions?.includeEvents || false}
              onChange={(e) => handleIncludeEventsChange(e.target.checked)}
            />
            <label htmlFor="includeEvents">イベントを含む</label>
          </div>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formColumn}>
          <label className={styles.formLabel}>出発地点</label>
          <input
            type="text"
            className={styles.formControl}
            value={searchParams.customOptions?.startingPoint || ''}
            onChange={(e) => handleStartingPointChange(e.target.value)}
            placeholder="例: 福岡空港"
          />
        </div>

        <div className={styles.formColumn}>
          <label className={styles.formLabel}>訪問スポット数</label>
          <input
            type="number"
            min="1"
            max="10"
            className={styles.formControl}
            value={searchParams.customOptions?.spotCount || ''}
            onChange={(e) => handleSpotCountChange(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>カテゴリー</label>
        <div className={styles.checkboxGroup}>
          {categoryOptions.map((option) => (
            <div key={option.id} className={styles.checkbox}>
              <input
                type="checkbox"
                id={`category-${option.id}`}
                className={styles.checkboxInput}
                checked={isCategorySelected(option.id)}
                onChange={(e) => handleCategoryChange(option.id, e.target.checked)}
              />
              <label htmlFor={`category-${option.id}`}>{option.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomSearchTab;
