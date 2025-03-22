'use client';

import React from 'react';
import { SearchParams } from '@/types/search';
import RangeSlider from '@/components/common/RangeSlider';
import styles from '@/styles/SearchForm.module.css';

interface NormalSearchTabProps {
  searchParams: SearchParams;
  updateSearchParams: (updates: Partial<SearchParams>) => void;
}

const NormalSearchTab: React.FC<NormalSearchTabProps> = ({
  searchParams,
  updateSearchParams,
}) => {
  // 性別と人数の更新
  const updateGenderInfo = (gender: 'male' | 'female', value: number) => {
    updateSearchParams({
      genderInfo: {
        ...searchParams.genderInfo,
        [gender]: value,
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

  return (
    <div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>性別と人数</label>
        <div className={styles.genderGroup}>
          <div>
            <label>男性</label>
            <input
              type="number"
              min="0"
              value={searchParams.genderInfo.male}
              onChange={(e) => updateGenderInfo('male', parseInt(e.target.value) || 0)}
              className={`${styles.formControl} ${styles.genderInput}`}
            />
            <span>人</span>
          </div>
          <div>
            <label>女性</label>
            <input
              type="number"
              min="0"
              value={searchParams.genderInfo.female}
              onChange={(e) => updateGenderInfo('female', parseInt(e.target.value) || 0)}
              className={`${styles.formControl} ${styles.genderInput}`}
            />
            <span>人</span>
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>予算範囲</label>
        <RangeSlider
          min={0}
          max={50000}
          step={1000}
          defaultMinValue={searchParams.budget.min}
          defaultMaxValue={searchParams.budget.max}
          onChange={handleBudgetChange}
          formatValue={formatBudget}
        />
      </div>
    </div>
  );
};

export default NormalSearchTab;
