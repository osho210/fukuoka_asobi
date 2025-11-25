'use client';

import React, { useState } from 'react';
import { SearchParams, CustomOptionsInput } from '@/types/search';
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
  const updateCustomOptions = (updates: Partial<CustomOptionsInput>) => {
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
      return '移動手段を選択してください';
    }
    const selected = transportationOptions.find(
      option => option.id === searchParams.customOptions?.transportationMethod
    );
    return selected ? selected.label : '移動手段を選択してください';
  };

  // 移動手段が選択されているか
  const hasSelectedTransportation = () => {
    return !!searchParams.customOptions?.transportationMethod;
  };

  // 選択されたテーマのテキスト
  const getSelectedThemeText = () => {
    if (!searchParams.customOptions?.theme) {
      return '遊びのテーマを選択してください';
    }
    const selected = themeOptions.find(
      option => option.id === searchParams.customOptions?.theme
    );
    return selected ? selected.label : '遊びのテーマを選択してください';
  };

  // テーマが選択されているか
  const hasSelectedTheme = () => {
    return !!searchParams.customOptions?.theme;
  };

  // 出発地点が入力されているか
  const hasStartingPoint = () => {
    return !!searchParams.customOptions?.startingPoint;
  };

  return (
    <div>
      {/* 移動手段 */}
      <div className="formGroup">
        <div
          className={`areaGroup ${hasSelectedTransportation() ? 'selected' : ''}`}
          onClick={() => setIsTransportationModalOpen(true)}
          role="button"
          aria-label="移動手段選択"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsTransportationModalOpen(true);
            }
          }}
        >
          <Image
            src="/car-icon.png"
            width={30}
            height={30}
            alt=""
            aria-hidden="true"
          />
          <span className={`selectionText ${!hasSelectedTransportation() ? 'placeholder' : ''}`}>
            {getSelectedTransportationText()}
          </span>
        </div>
      </div>

      {/* テーマ */}
      <div className="formGroup">
        <div
          className={`areaGroup ${hasSelectedTheme() ? 'selected' : ''}`}
          onClick={() => setIsThemeModalOpen(true)}
          role="button"
          aria-label="テーマ選択"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsThemeModalOpen(true);
            }
          }}
        >
          <Image
            src="/atmosphere-icon.png"
            width={30}
            height={30}
            alt=""
            aria-hidden="true"
          />
          <span className={`selectionText ${!hasSelectedTheme() ? 'placeholder' : ''}`}>
            {getSelectedThemeText()}
          </span>
        </div>
      </div>

      {/* トグルオプション */}
      <div className="formGroup">
        <div className="toggleOptionsContainer">
          <div
            className={`toggleOption ${searchParams.customOptions?.rainyDayOption ? 'toggleOptionActive' : ''}`}
            onClick={() => handleRainyDayOptionChange(!searchParams.customOptions?.rainyDayOption)}
            role="button"
            aria-pressed={!!searchParams.customOptions?.rainyDayOption}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRainyDayOptionChange(!searchParams.customOptions?.rainyDayOption);
              }
            }}
          >
            <div className="toggleIcon">☂️</div>
            <span>雨天でも楽しめる</span>
          </div>

          <div
            className={`toggleOption ${searchParams.customOptions?.includeEvents ? 'toggleOptionActive' : ''}`}
            onClick={() => handleIncludeEventsChange(!searchParams.customOptions?.includeEvents)}
            role="button"
            aria-pressed={!!searchParams.customOptions?.includeEvents}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleIncludeEventsChange(!searchParams.customOptions?.includeEvents);
              }
            }}
          >
            <div className="toggleIcon">🎭</div>
            <span>イベントを含む</span>
          </div>
        </div>
      </div>

      {/* 出発地点とスポット数 */}
      <div className="formRow">
        <div className="formColumn">
          <label className="formLabel">出発地点</label>
          <div
            className={`areaGroup ${hasStartingPoint() ? 'selected' : ''}`}
            onClick={() => setIsStartingPointModalOpen(true)}
            role="button"
            aria-label="出発地点入力"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsStartingPointModalOpen(true);
              }
            }}
          >
            <Image
              src="/location_icon.svg"
              width={24}
              height={24}
              alt=""
              aria-hidden="true"
            />
            <span className={`selectionText ${!hasStartingPoint() ? 'placeholder' : ''}`}>
              {searchParams.customOptions?.startingPoint || '出発地点を入力してください'}
            </span>
          </div>
        </div>

        <div className="formColumn">
          <label className="formLabel" htmlFor="spot-count">
            訪問スポット数
          </label>
          <input
            id="spot-count"
            type="number"
            min="1"
            max="10"
            className="formControl"
            placeholder="例: 3"
            value={searchParams.customOptions?.spotCount || ''}
            onChange={(e) => handleSpotCountChange(parseInt(e.target.value) || 0)}
            aria-label="訪問スポット数"
          />
        </div>
      </div>

      {/* カテゴリー選択 */}
      <div className="categoryGroup">
        <label className="categoryFormLabel">プランに含めるカテゴリー</label>
        <div className="categoryButtonsContainer">
          {categoryOptions.map((option) => (
            <button
              key={option.id}
              className={`categoryButton ${isCategorySelected(option.id) ? 'categoryButtonActive' : ''}`}
              onClick={() => handleCategoryChange(option.id)}
              aria-pressed={isCategorySelected(option.id)}
              aria-label={`${option.label}を${isCategorySelected(option.id) ? '選択解除' : '選択'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 移動手段選択モーダル */}
      {isTransportationModalOpen && (
        <div
          className="modalOverlay"
          onClick={() => setIsTransportationModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="transportation-modal-title"
        >
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 id="transportation-modal-title" className="modalTitle">
                移動手段を選択
              </h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsTransportationModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <p className="modalDescription">
                メインの移動手段を選択してください
              </p>
              <div className="optionsList">
                {transportationOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`optionItem ${searchParams.customOptions?.transportationMethod === option.id ? 'optionItemActive' : ''}`}
                    onClick={() => handleTransportationChange(option.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTransportationChange(option.id);
                      }
                    }}
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
        <div
          className="modalOverlay"
          onClick={() => setIsThemeModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-modal-title"
        >
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 id="theme-modal-title" className="modalTitle">
                テーマを選択
              </h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsThemeModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <p className="modalDescription">
                遊びのテーマを選択してください
              </p>
              <div className="optionsList">
                {themeOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`optionItem ${searchParams.customOptions?.theme === option.id ? 'optionItemActive' : ''}`}
                    onClick={() => handleThemeChange(option.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleThemeChange(option.id);
                      }
                    }}
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
        <div
          className="modalOverlay"
          onClick={() => setIsStartingPointModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="starting-point-modal-title"
        >
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 id="starting-point-modal-title" className="modalTitle">
                出発地点を入力
              </h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsStartingPointModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <p className="modalDescription">
                プランの出発地点を入力してください（駅名、空港名、地域名など）
              </p>
              <input
                type="text"
                className="formControl"
                value={searchParams.customOptions?.startingPoint || ''}
                onChange={(e) => handleStartingPointChange(e.target.value)}
                placeholder="例: 福岡空港、博多駅"
                aria-label="出発地点"
                autoFocus
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
