'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECOMMENDED_FORS } from '@/graphql/queries/getRecommendedFors';
import { RecommendedFor } from '@/__generated__/graphql';
import { SearchParams } from '@/types/search';
import RangeSlider from '@/components/common/RangeSlider';
import AreaMap from '@/components/common/AreaMap';
import DatePicker from '@/components/common/DatePicker';
import TimePicker from '@/components/common/TimePicker';
import '@/styles/SearchForm.css';
import Image from 'next/image';
import { areaPositions } from '@/components/common/AreaMap';

interface NormalSearchTabProps {
  searchParams: SearchParams;
  updateSearchParams: (updates: Partial<SearchParams>) => void;
}

const NormalSearchTab: React.FC<NormalSearchTabProps> = ({
  searchParams,
  updateSearchParams,
}) => {
  // モーダルの表示状態
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // おすすめ対象の取得
  const { loading, error, data } = useQuery(GET_RECOMMENDED_FORS);
  const recommendedFors: RecommendedFor[] = data?.recommendedFors ?? [];

  // 利用メンバー情報の更新
  const updateMemberInfo = (selectedIds: string[]) => {
    updateSearchParams({
      memberInfo: {
        recommendUsers: selectedIds,
      },
    });
  };

  // 予算範囲の更新
  const handleBudgetChange = (min: number, max: number) => {
    updateSearchParams({
      budget: { min, max },
    });
  };

  // 予算を表示用にフォーマット
  const formatBudget = (value: number) => {
    return `${value.toLocaleString()}円`;
  };

  // エリア選択の更新
  const handleAreaChange = (areas: string[]) => {
    updateSearchParams({ districts: areas });
  };

  // 日付をYYYY-MM-DD形式に変換
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 日付選択時の処理
  const handleDateChange = (selectedDate: Date) => {
    const formattedDate = formatDate(selectedDate);
    updateSearchParams({
      date: formattedDate,
    });
  };

  // 開始時間選択時の処理
  const handleStartTimeChange = (time: string) => {
    updateSearchParams({
      startTime: time,
    });
  };

  // 終了時間選択時の処理
  const handleEndTimeChange = (time: string) => {
    updateSearchParams({
      endTime: time,
    });
  };

  // 文字列の日付をDateオブジェクトに変換
  const parseDate = (dateStr?: string | null): Date | null => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // 選択されたエリアの表示
  const getSelectedAreasText = () => {
    if (!searchParams.districts || searchParams.districts.length === 0) {
      return 'エリアを選択してください';
    }
    // IDを名前に変換
    const areaNames = searchParams.districts
      .map((id) => {
        const area = areaPositions.find((a) => a.id === id);
        return area ? area.name : id;
      })
      .filter(Boolean);

    return areaNames.join(' / ');
  };

  // エリアが選択されているか
  const hasSelectedAreas = () => {
    return searchParams.districts && searchParams.districts.length > 0;
  };

  // 選択された日時の表示
  const getSelectedDateTimeText = () => {
    if (!searchParams.date) {
      return '日時を選択してください';
    }

    const date = parseDate(searchParams.date);
    if (!date) return '日時を選択してください';

    const dateText = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

    if (searchParams.startTime && searchParams.endTime) {
      return `${dateText} ${searchParams.startTime}〜${searchParams.endTime}`;
    } else if (searchParams.startTime) {
      return `${dateText} ${searchParams.startTime}〜`;
    } else {
      return dateText;
    }
  };

  // 日時が選択されているか
  const hasSelectedDateTime = () => {
    return !!searchParams.date;
  };

  // メンバーが選択されているか
  const hasSelectedMembers = () => {
    return searchParams.memberInfo.recommendUsers.length > 0;
  };

  // 選択されたメンバーのテキスト
  const getSelectedMembersText = () => {
    if (!hasSelectedMembers()) {
      return '利用メンバーを選択してください';
    }
    return `${searchParams.memberInfo.recommendUsers.length}件選択中`;
  };

  return (
    <div>
      {/* エリア */}
      <div className="formGroup">
        <div
          className={`areaGroup ${hasSelectedAreas() ? 'selected' : ''}`}
          onClick={() => setIsAreaModalOpen(true)}
          role="button"
          aria-label="エリア選択"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsAreaModalOpen(true);
            }
          }}
        >
          <Image
            src="/location_icon.svg"
            width={30}
            height={30}
            alt=""
            aria-hidden="true"
          />
          <span className={`selectionText ${!hasSelectedAreas() ? 'placeholder' : ''}`}>
            {getSelectedAreasText()}
          </span>
        </div>
      </div>

      {/* 日時 */}
      <div className="formGroup">
        <div
          className={`areaGroup ${hasSelectedDateTime() ? 'selected' : ''}`}
          onClick={() => setIsDateTimeModalOpen(true)}
          role="button"
          aria-label="日時選択"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsDateTimeModalOpen(true);
            }
          }}
        >
          <Image
            src="/calendar_icon.svg"
            width={30}
            height={30}
            alt=""
            aria-hidden="true"
          />
          <span className={`selectionText ${!hasSelectedDateTime() ? 'placeholder' : ''}`}>
            {getSelectedDateTimeText()}
          </span>
        </div>
      </div>

      {/* 利用メンバー */}
      <div className="formGroup">
        <div
          className={`areaGroup ${hasSelectedMembers() ? 'selected' : ''}`}
          onClick={() => setIsMemberModalOpen(true)}
          role="button"
          aria-label="利用メンバー選択"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsMemberModalOpen(true);
            }
          }}
        >
          <Image
            src="/member_icon.svg"
            width={30}
            height={30}
            alt=""
            aria-hidden="true"
          />
          <span className={`selectionText ${!hasSelectedMembers() ? 'placeholder' : ''}`}>
            {getSelectedMembersText()}
          </span>
        </div>
      </div>

      {/* 予算 */}
      <label className="formLabel" htmlFor="budget-slider">
        予算範囲
      </label>
      <div className="formGroup">
        <RangeSlider
          min={0}
          max={20000}
          step={1500}
          defaultMinValue={searchParams.budget.min ?? 0}
          defaultMaxValue={searchParams.budget.max ?? 20000}
          onChange={handleBudgetChange}
          formatValue={formatBudget}
        />
      </div>

      {/* エリア選択モーダル */}
      {isAreaModalOpen && (
        <div
          className="modalOverlay"
          onClick={() => setIsAreaModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="area-modal-title"
        >
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 id="area-modal-title" className="modalTitle">
                エリアを選択
              </h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsAreaModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <p className="modalDescription">
                福岡県内で遊びたいエリアを選択してください
                <br />
                （最大3つまで、福岡市内は1つのみ選択可能）
              </p>
              <AreaMap
                selectedAreas={searchParams.districts || []}
                onChange={handleAreaChange}
                maxSelections={3}
                title=""
                description=""
              />
            </div>
            <div className="modalFooter">
              <button
                className="modalButton"
                onClick={() => setIsAreaModalOpen(false)}
              >
                選択完了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 日時選択モーダル */}
      {isDateTimeModalOpen && (
        <div
          className="modalOverlay"
          onClick={() => setIsDateTimeModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="datetime-modal-title"
        >
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 id="datetime-modal-title" className="modalTitle">
                日時を選択
              </h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsDateTimeModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <div className="formGroup">
                <label className="formLabel" htmlFor="visit-date">
                  訪問予定日
                </label>
                <DatePicker
                  selectedDate={parseDate(searchParams.date)}
                  onChange={handleDateChange}
                  minDate={new Date()}
                />
              </div>

              <div className="formRow">
                <div className="formColumn">
                  <label className="formLabel" htmlFor="start-time">
                    開始時間
                  </label>
                  <TimePicker
                    selectedTime={searchParams.startTime || null}
                    onChange={handleStartTimeChange}
                    interval={30}
                    startTime="09:00"
                    endTime="21:00"
                  />
                </div>

                <div className="formColumn">
                  <label className="formLabel" htmlFor="end-time">
                    終了時間
                  </label>
                  <TimePicker
                    selectedTime={searchParams.endTime || null}
                    onChange={handleEndTimeChange}
                    interval={30}
                    startTime="09:00"
                    endTime="23:30"
                  />
                </div>
              </div>
            </div>
            <div className="modalFooter">
              <button
                className="modalButton"
                onClick={() => setIsDateTimeModalOpen(false)}
              >
                選択完了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 利用メンバー選択モーダル */}
      {isMemberModalOpen && (
        <div
          className="modalOverlay"
          onClick={() => setIsMemberModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-modal-title"
        >
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 id="member-modal-title" className="modalTitle">
                利用メンバーを選択
              </h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsMemberModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p>読み込み中...</p>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                  <p>エラーが発生しました</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {error.message}
                  </p>
                </div>
              ) : (
                <div className="recommendedForList">
                  <p className="modalDescription">
                    利用メンバーを選択してください（複数選択可）
                  </p>
                  {recommendedFors.map((item) => (
                    <div key={item.id} className="recommendedForItem">
                      <label className="checkboxLabel">
                        <input
                          type="checkbox"
                          checked={searchParams.memberInfo.recommendUsers.includes(
                            item.id,
                          )}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentIds = [
                              ...searchParams.memberInfo.recommendUsers,
                            ];

                            if (isChecked && !currentIds.includes(item.id)) {
                              updateMemberInfo([...currentIds, item.id]);
                            } else if (!isChecked && currentIds.includes(item.id)) {
                              updateMemberInfo(
                                currentIds.filter((id) => id !== item.id),
                              );
                            }
                          }}
                          className="checkbox"
                          aria-label={`${item.name}を選択`}
                        />
                        {item.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modalFooter">
              <button
                className="modalButton"
                onClick={() => setIsMemberModalOpen(false)}
              >
                選択完了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NormalSearchTab;
