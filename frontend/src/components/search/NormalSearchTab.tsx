'use client';

import React, { useState, useEffect } from 'react';
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
  const [recommendedFors, setRecommendedFors] = useState<RecommendedFor[]>([]);

  // データが取得できたらステートを更新
  useEffect(() => {
    if (data && data.recommendedFors) {
      setRecommendedFors(data.recommendedFors);
    }
  }, [data]);

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

  // 日付をYYYY-MM-DD形式に変換
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 文字列の日付をDateオブジェクトに変換
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // 選択されたエリアの表示
  const getSelectedAreasText = () => {
    if (!searchParams.districts || searchParams.districts.length === 0) {
      return 'エリアを選択';
    }
    return `${[...searchParams.districts]}`;
  };

  // 選択された日時の表示
  const getSelectedDateTimeText = () => {
    if (!searchParams.date) {
      return '日時を選択';
    }

    const date = parseDate(searchParams.date);
    if (!date) return '日時を選択';

    const dateText = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

    if (searchParams.startTime && searchParams.endTime) {
      return `${dateText} ${searchParams.startTime}〜${searchParams.endTime}`;
    } else if (searchParams.startTime) {
      return `${dateText} ${searchParams.startTime}〜`;
    } else {
      return dateText;
    }
  };

  return (
    <div className="searchForm">
      <div className="formGroup">
        <div className="areaGroup" onClick={() => setIsAreaModalOpen(true)}>
          <Image src="/location_icon.svg" width={'30'} height={'30'} alt='エリア' />
          <span className="selectionText">{getSelectedAreasText()}</span>
        </div>
        <div className="calendarGroup" onClick={() => setIsDateTimeModalOpen(true)}>
          <Image src="/calendar_icon.svg" width={'30'} height={'30'} alt='日付' />
          <span className="selectionText">{getSelectedDateTimeText()}</span>
        </div>
        <div className="memberGroup" onClick={() => setIsMemberModalOpen(true)}>
          <Image src="/member_icon.svg" width={'30'} height={'30'} alt='利用メンバー' />
          <span className="selectionText">
            {searchParams.memberInfo.recommendUsers.length > 0
              ? `${searchParams.memberInfo.recommendUsers.length}件選択中`
              : '利用メンバーを選択'}
          </span>
        </div>
        <div className="budgetGroup">
          <label className="formLabel">予算</label>
          <RangeSlider
            min={0}
            max={20000}
            step={1500}
            defaultMinValue={searchParams.budget.min}
            defaultMaxValue={searchParams.budget.max}
            onChange={handleBudgetChange}
            formatValue={formatBudget}
          />
        </div>
      </div>

      {/* エリア選択モーダル */}
      {isAreaModalOpen && (
        <div className="modalOverlay" onClick={() => setIsAreaModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">エリアを選択</h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsAreaModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <AreaMap
                selectedAreas={searchParams.districts || []}
                onChange={handleAreaChange}
                maxSelections={3}
                title=""
                description="福岡県内で遊びたいエリアを選択してください（最大3つまで）(福岡市内は1つのみ選択可能)"
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
        <div className="modalOverlay" onClick={() => setIsDateTimeModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">日時を選択</h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsDateTimeModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <div className="formGroup">
                <label className="formLabel">訪問予定日</label>
                <DatePicker
                  selectedDate={parseDate(searchParams.date)}
                  onChange={handleDateChange}
                  minDate={new Date()} // 今日以降の日付のみ選択可能
                />
              </div>

              <div className="formRow">
                <div className="formColumn">
                  <label className="formLabel">開始時間</label>
                  <TimePicker
                    selectedTime={searchParams.startTime || null}
                    onChange={handleStartTimeChange}
                    interval={30}
                    startTime="09:00"
                    endTime="21:00"
                  />
                </div>

                <div className="formColumn">
                  <label className="formLabel">終了時間</label>
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
        <div className="modalOverlay" onClick={() => setIsMemberModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">利用メンバーを選択</h2>
              <button
                className="modalCloseButton"
                onClick={() => setIsMemberModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              {loading ? (
                <p>読み込み中...</p>
              ) : error ? (
                <p>エラーが発生しました: {error.message}</p>
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
                          checked={searchParams.memberInfo.recommendUsers.includes(item.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentIds = [...searchParams.memberInfo.recommendUsers];

                            if (isChecked && !currentIds.includes(item.id)) {
                              updateMemberInfo([...currentIds, item.id]);
                            } else if (!isChecked && currentIds.includes(item.id)) {
                              updateMemberInfo(currentIds.filter(id => id !== item.id));
                            }
                          }}
                          className="checkbox"
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
    </div>)
};

export default NormalSearchTab;
