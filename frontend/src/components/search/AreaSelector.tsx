'use client';

import React from 'react';
import AreaMap from '@/components/common/AreaMap';
import styles from '@/styles/SearchForm.module.css';

interface AreaSelectorProps {
  selectedAreas: string[];
  onChange: (areas: string[]) => void;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({ selectedAreas, onChange }) => {
  return (
    <div className={styles.formSection}>
      <h2 className={styles.sectionTitle}>エリアを選択</h2>
      <p className={styles.mapDescription}>
        福岡県内で遊びたいエリアを選択してください（最大3つまで）
      </p>
      <AreaMap
        selectedAreas={selectedAreas}
        onChange={onChange}
        maxSelections={3}
        title=""
        description=""
      />
    </div>
  );
};

export default AreaSelector;
