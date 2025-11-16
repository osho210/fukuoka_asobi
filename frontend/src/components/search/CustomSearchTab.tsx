'use client';

import React, { useState } from 'react';
import { SearchParams } from '@/types/search';
import '@/styles/SearchForm.css';
import Image from 'next/image';
import { useOptions } from '@/lib/hooks/useOptions';

interface CustomSearchTabProps {
  searchParams: SearchParams;
  updateSearchParams: (updates: Partial<SearchParams>) => void;
}

const CustomSearchTab: React.FC<CustomSearchTabProps> = ({
  searchParams,
  updateSearchParams,
}) => {
  const { themeOptions, transportationOptions, categoryOptions } = useOptions();
  // モーダルの表示状態
  const [isTransportationModalOpen, setIsTransportationModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isStartingPointModalOpen, setIsStartingPointModalOpen] = useState(false);

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
    setIsTransportationModalOpen(false);
  };

  // テーマの更新
  const handleThemeChange = (theme: string) => {
    updateCustomOptions({ theme });
    setIsThemeModalOpen(false);
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

  // 出発地点の確定
  const handleStartingPointConfirm = () => {
    setIsStartingPointModalOpen(false);
  };

  // スポット数の更新
  const handleSpotCountChange = (count: number) => {
    updateCustomOptions({ spotCount: count });
  };

  // カテゴリーの更新
  const handleCategoryChange = (categoryId: string) => {
    const currentCategories = searchParams.customOptions?.categories || [];

    // 既に選択されている場合は削除、そうでなければ追加
    if (currentCategories.includes(categoryId)) {
      updateCustomOptions({
        categories: currentCategories.filter(id => id !== categoryId)
      });
    } else {
      updateCustomOptions({
        categories: [...currentCategories, categoryId]
      });
    }
  };

  // カテゴリーが選択されているかチェック
  const isCategorySelected = (categoryId: string): boolean => {
    return searchParams.customOptions?.categories?.includes(categoryId) || false;
  };

  // 選択された移動手段のテキスト
  const getSelectedTransportationText = () => {
    if (!searchParams.customOptions?.transportationMethod) {
      return '移動手段を選択';
    }
    const selected = transportationOptions.find(
      option => option.id === searchParams.customOptions?.transportationMethod
    );
    return selected ? selected.label : '移動手段を選択';
  };

  // 選択されたテーマのテキスト
  const getSelectedThemeText = () => {
    if (!searchParams.customOptions?.theme) {
      return '遊びのテーマを選択';
    }
    const selected = themeOptions.find(
      option => option.id === searchParams.customOptions?.theme
    );
    return selected ? selected.label : '遊びのテーマを選択';
  };

  return (
    <div>
      <div className="formGroup">
        <div
          className="areaGroup"
          onClick={() => setIsTransportationModalOpen(true)}
        >
          <Image src="/calendar_icon.svg" width={30} height={30} alt='移動手段' />
          <span className="selectionText">{getSelectedTransportationText()}</span>
        </div>
      </div>

      <div className="formGroup">
        <div
          className="areaGroup"
          onClick={() => setIsThemeModalOpen(true)}
        >
          <Image src="/calendar_icon.svg" width={30} height={30} alt='テーマ' />
          <span className="selectionText">{getSelectedThemeText()}</span>
        </div>
      </div>

      <div className="formGroup">
        <div className="toggleOptionsContainer">
          <div
            className={`toggleOption ${searchParams.customOptions?.rainyDayOption ? "toggleOptionActive" : ''}`}
            onClick={() => handleRainyDayOptionChange(!searchParams.customOptions?.rainyDayOption)}
          >
            <div className="toggleIcon">
              ☂️
            </div>
            <span>雨天でも楽しめる</span>
          </div>

          <div
            className={`toggleOption ${searchParams.customOptions?.includeEvents ? "toggleOptionActive" : ''}`}
            onClick={() => handleIncludeEventsChange(!searchParams.customOptions?.includeEvents)}
          >
            <div className="toggleIcon">
              🎭
            </div>
            <span>イベントを含む</span>
          </div>
        </div>
      </div>

      <div className="formRow">
        <div className="formColumn">
          <div
            className="areaGroup"
            onClick={() => setIsStartingPointModalOpen(true)}
          >
            <Image src="/location_icon.svg" width={30} height={30} alt='出発地点' />
            <span className="selectionText">
              {searchParams.customOptions?.startingPoint || '出発地点を入力'}
            </span>
          </div>
        </div>

        <div className="formColumn">
          <label className={""}>訪問スポット数</label>
          <input
            type="number"
            min="1"
            max="10"
            className="formControl"
            value={searchParams.customOptions?.spotCount || ''}
            onChange={(e) => handleSpotCountChange(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="categoryGroup">
        <label className="categoryFormLabel">プランに含めるカテゴリー</label>
        <div className="categoryButtonsContainer">
          {categoryOptions.map((option) => (
            <button
              key={option.id}
              className={`categoryButton ${isCategorySelected(option.id) ? "categoryButtonActive" : ''}`}
              onClick={() => handleCategoryChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 移動手段選択モーダル */}
      {isTransportationModalOpen && (
        <div className="modalOverlay" onClick={() => setIsTransportationModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">移動手段を選択</h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsTransportationModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <div className="optionsList">
                {transportationOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`optionItem ${searchParams.customOptions?.transportationMethod === option.id ? "optionItemActive" : ''}`}
                    onClick={() => handleTransportationChange(option.id)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* テーマ選択モーダル */}
      {isThemeModalOpen && (
        <div className="modalOverlay" onClick={() => setIsThemeModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">テーマを選択</h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsThemeModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <div className="optionsList">
                {themeOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`optionItem ${searchParams.customOptions?.theme === option.id ? "optionItemActive" : ''}`}
                    onClick={() => handleThemeChange(option.id)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 出発地点入力モーダル */}
      {isStartingPointModalOpen && (
        <div className="modalOverlay" onClick={() => setIsStartingPointModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">出発地点を入力</h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsStartingPointModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <input
                type="text"
                className="formControl"
                value={searchParams.customOptions?.startingPoint || ''}
                onChange={(e) => handleStartingPointChange(e.target.value)}
                placeholder="例: 福岡空港"
              />
            </div>
            <div className="modalFooter">
              <button
                className="modalButton"
                onClick={handleStartingPointConfirm}
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSearchTab;
