'use client';

import React from 'react';
import '@/styles/AreaMap.css';
import Image from 'next/image';

interface AreaMapProps {
  selectedAreas: string[];
  onChange: (districts: string[]) => void;
  maxSelections?: number;
  title?: string;
  description?: string;
}

export interface AreaPosition {
  id: string;
  name: string;
  top: string;  // CSSのtopプロパティ用
  left: string; // CSSのleftプロパティ用
}

export const areaPositions: AreaPosition[] = [
  { id: 'itoshima', name: '糸島', top: '25%', left: '-10%' },
  { id: 'kasuya', name: '糟屋郡', top: '10%', left: '8%' },
  { id: 'munakata', name: '宗像', top: '-3%', left: '36%' },
  { id: 'kitakyushu', name: '北九州市', top: '5%', left: '70%' },
  { id: 'asakura', name: '朝倉', top: '53%', left: '80%' },
  { id: 'ukiha', name: 'うきは', top: '68%', left: '76%' },
  { id: 'yame', name: '八女', top: '85%', left: '47%' },
  { id: 'omuta', name: '大牟田', top: '96%', left: '25%' },
  { id: 'yanagawa', name: '柳川', top: '87%', left: '8%' },
  { id: 'kurume', name: '久留米', top: '74%', left: '0%' },
  { id: 'dazaifu_onojo', name: '太宰府・大野城', top: '60%', left: '-5%' },
  { id: 'fukuoka_city', name: '福岡市', top: '45%', left: '-10%' },
];

const AreaMap: React.FC<AreaMapProps> = ({
  selectedAreas,
  onChange,
  maxSelections = 3,
  title = 'エリアを選択',
  description = '地図から最大3つのエリアを選択してください',
}) => {

  // エリアをクリックしたときの処理
  const handleAreaClick = (areaId: string) => {
    if (selectedAreas.includes(areaId)) {
      // 選択解除
      onChange(selectedAreas.filter((id) => id !== areaId));
    } else if (selectedAreas.length < maxSelections) {
      // 選択追加（最大選択数未満の場合）
      onChange([...selectedAreas, areaId]);
    } else {
      alert(`エリアは最大${maxSelections}つまで選択可能です`);
    }
  };


  return (
    <div className="mapContainer">
      {title && <h3 className="mapTitle">{title}</h3>}
      {description && <p className="mapDescription">{description}</p>}

      <div className="mapWrapper">
        <Image src="/fukuoka_map.svg" alt="福岡市地図" width={300} height={300} />
        {areaPositions.map((area) => (
          <button
            key={area.id}
            type="button"
            value={area.name}
            onClick={() => handleAreaClick(area.id)}
            className={`areaButton ${selectedAreas.includes(area.id) ? "selected" : ''
              }`}
            style={{ top: area.top, left: area.left }}
          >
            {area.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AreaMap;
