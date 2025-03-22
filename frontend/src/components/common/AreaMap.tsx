'use client';

import React, { useState } from 'react';
import styles from '@/styles/AreaMap.module.css';
import { AreaData, fukuokaAreas } from '@/data/fukuokaAreas';

interface AreaMapProps {
  selectedAreas: string[];
  onChange: (areas: string[]) => void;
  maxSelections?: number;
  title?: string;
  description?: string;
}

const AreaMap: React.FC<AreaMapProps> = ({
  selectedAreas,
  onChange,
  maxSelections = 3,
  title = 'エリアを選択',
  description = '地図から最大3つのエリアを選択してください',
}) => {
  const [areas] = useState<AreaData[]>(fukuokaAreas);
  const viewBox = '0 0 300 300';

  // エリアをクリックしたときの処理
  const handleAreaClick = (areaId: string) => {
    // すでに選択されている場合は選択解除
    if (selectedAreas.includes(areaId)) {
      onChange(selectedAreas.filter((id) => id !== areaId));
      return;
    }

    // 最大選択数に達している場合は何もしない
    if (selectedAreas.length >= maxSelections) {
      return;
    }

    // 新しいエリアを選択に追加
    onChange([...selectedAreas, areaId]);
  };

  // 選択エリアを削除
  const handleRemoveArea = (areaId: string) => {
    onChange(selectedAreas.filter((id) => id !== areaId));
  };

  // エリア名を取得
  const getAreaName = (areaId: string) => {
    const area = areas.find((a) => a.id === areaId);
    return area ? area.name : '';
  };

  return (
    <div className={styles.mapContainer}>
      {title && <h3 className={styles.mapTitle}>{title}</h3>}
      {description && <p className={styles.mapDescription}>{description}</p>}

      <svg
        className={styles.mapSvg}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
      >
        {areas.map((area) => {
          const isSelected = selectedAreas.includes(area.id);
          return (
            <g key={area.id}>
              <path
                d={area.path}
                className={`${styles.areaPath} ${
                  isSelected ? styles.selectedArea : ''
                }`}
                onClick={() => handleAreaClick(area.id)}
              />
              <text
                x={area.center.x}
                y={area.center.y}
                className={`${styles.areaLabel} ${
                  isSelected ? styles.selectedAreaLabel : ''
                }`}
              >
                {area.name}
              </text>
            </g>
          );
        })}
      </svg>

      {selectedAreas.length > 0 && (
        <div className={styles.areasList}>
          {selectedAreas.map((areaId) => (
            <div key={areaId} className={styles.areaTag}>
              {getAreaName(areaId)}
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveArea(areaId)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaMap;
