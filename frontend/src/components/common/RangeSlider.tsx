'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import '@/styles/RangeSlider.css';


interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultMinValue?: number;
  defaultMaxValue?: number;
  label?: string;
  onChange?: (minValue: number, maxValue: number) => void;
  formatValue?: (value: number) => string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  defaultMinValue = min,
  defaultMaxValue = max,
  label,
  onChange,
  formatValue = (value) => value.toString(),
}) => {
  const [minValue, setMinValue] = useState(defaultMinValue);
  const [maxValue, setMaxValue] = useState(defaultMaxValue);
  const trackRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);
  const isDraggingMin = useRef(false);
  const isDraggingMax = useRef(false);

  // 値をパーセンテージに変換
  const valueToPercent = useCallback((value: number) => {
    return ((value - min) / (max - min)) * 100;
  }, [min, max]);

  // パーセンテージを値に変換
  const percentToValue = useCallback((percent: number) => {
    const rawValue = min + ((max - min) * percent) / 100;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  }, [min, max, step]);

  // スライダーの位置を更新
  const updateSliderPositions = useCallback(() => {
    if (!trackRef.current || !minThumbRef.current || !maxThumbRef.current) return;

    const minPercent = valueToPercent(minValue);
    const maxPercent = valueToPercent(maxValue);

    minThumbRef.current.style.left = `${minPercent}%`;
    maxThumbRef.current.style.left = `${maxPercent}%`;

    const rangeElement = trackRef.current.querySelector('.sliderRange') as HTMLElement;
    if (rangeElement) {
      rangeElement.style.left = `${minPercent}%`;
      rangeElement.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minValue, maxValue, valueToPercent]);

  // マウスイベントハンドラー
  const handleMouseDown = (e: React.MouseEvent, isMin: boolean) => {
    e.preventDefault();
    if (isMin) {
      isDraggingMin.current = true;
    } else {
      isDraggingMax.current = true;
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingMin.current && !isDraggingMax.current) return;
    if (!trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max(((e.clientX - trackRect.left) / trackRect.width) * 100, 0),
      100
    );
    const newValue = percentToValue(percent);

    if (isDraggingMin.current) {
      if (newValue <= maxValue - step) {
        setMinValue(newValue);
        onChange?.(newValue, maxValue);
      }
    } else if (isDraggingMax.current) {
      if (newValue >= minValue + step) {
        setMaxValue(newValue);
        onChange?.(minValue, newValue);
      }
    }
  }, [minValue, maxValue, step, onChange, percentToValue]);

  const handleMouseUp = () => {
    isDraggingMin.current = false;
    isDraggingMax.current = false;
  };

  // トラックをクリックした時の処理
  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const percent = ((e.clientX - trackRect.left) / trackRect.width) * 100;
    const newValue = percentToValue(percent);

    // クリックした位置が最小値と最大値のどちらに近いかで処理を分ける
    if (Math.abs(newValue - minValue) <= Math.abs(newValue - maxValue)) {
      setMinValue(newValue);
      onChange?.(newValue, maxValue);
    } else {
      setMaxValue(newValue);
      onChange?.(minValue, newValue);
    }
  };

  // イベントリスナーの設定
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  // スライダーの位置を更新
  useEffect(() => {
    updateSliderPositions();
  }, [updateSliderPositions]);

  return (
    <div className="sliderContainer">
      {label && <div className="sliderLabel">{label}</div>}
      <div
        ref={trackRef}
        className="sliderTrack"
        onClick={handleTrackClick}
      >
        <div className="sliderRange"></div>
        <div
          ref={minThumbRef}
          className="sliderThumb"
          onMouseDown={(e) => handleMouseDown(e, true)}
        ></div>
        <div
          ref={maxThumbRef}
          className="sliderThumb"
          onMouseDown={(e) => handleMouseDown(e, false)}
        ></div>
      </div>
      <div className="sliderValues">
        <span>{formatValue(minValue)}</span>
        <span>{formatValue(maxValue)}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
