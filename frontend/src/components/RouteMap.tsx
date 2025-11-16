'use client';

import React, { useEffect, useRef } from 'react';
import { TravelRoute } from '@/__generated__/graphql';
import { formatTravelTime } from '@/utils/dateUtils';
import styles from '@/styles/RouteMap.module.css';

interface RouteMapProps {
  travelRoute: TravelRoute;
}

const RouteMap: React.FC<RouteMapProps> = ({ travelRoute }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 移動手段の色
  const getTravelMethodColor = (method: string): string => {
    switch (method) {
      case 'walk':
        return '#4CAF50'; // 緑
      case 'car':
        return '#2196F3'; // 青
      case 'train':
        return '#F44336'; // 赤
      case 'bicycle':
        return '#FF9800'; // オレンジ
      default:
        return '#9E9E9E'; // グレー
    }
  };

  // 移動手段のラベル
  const getTravelMethodLabel = (method: string): string => {
    switch (method) {
      case 'walk':
        return '徒歩';
      case 'car':
        return '車';
      case 'train':
        return '電車';
      case 'bicycle':
        return '自転車';
      default:
        return 'その他';
    }
  };

  useEffect(() => {
    if (!canvasRef.current || travelRoute.travelSegments.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // スポット数（出発地点と目的地を含む）
    const spotCount = travelRoute.travelSegments.length + 1;

    // マージン
    const margin = 50;
    const width = canvas.width - margin * 2;
    const height = canvas.height - margin * 2;

    // 円の半径
    const radius = 15;

    // スポットの座標を計算（簡易的な円形レイアウト）
    const spots: { x: number; y: number; name: string }[] = [];

    // 最初のスポット（最初のセグメントのfromSpot）
    spots.push({
      x: margin + width / 2,
      y: margin,
      name: travelRoute.travelSegments[0].fromSpot.spotName
    });

    // 中間のスポット
    const angleStep = Math.PI / (spotCount - 1);
    for (let i = 1; i < spotCount - 1; i++) {
      const angle = Math.PI / 2 + angleStep * i;
      const x = margin + width / 2 + Math.cos(angle) * (width / 2 - radius);
      const y = margin + height / 2 + Math.sin(angle) * (height / 2 - radius);
      spots.push({
        x,
        y,
        name: travelRoute.travelSegments[i - 1].toSpot.spotName
      });
    }

    // 最後のスポット（最後のセグメントのtoSpot）
    spots.push({
      x: margin + width / 2,
      y: margin + height,
      name: travelRoute.travelSegments[travelRoute.travelSegments.length - 1].toSpot.spotName
    });

    // 線を描画
    for (let i = 0; i < travelRoute.travelSegments.length; i++) {
      const segment = travelRoute.travelSegments[i];
      const fromSpot = spots[i];
      const toSpot = spots[i + 1];

      // 線の色を設定
      ctx.strokeStyle = getTravelMethodColor(segment.travelMethod);
      ctx.lineWidth = 3;

      // 線を描画
      ctx.beginPath();
      ctx.moveTo(fromSpot.x, fromSpot.y);
      ctx.lineTo(toSpot.x, toSpot.y);
      ctx.stroke();

      // 移動手段と時間を表示
      const midX = (fromSpot.x + toSpot.x) / 2;
      const midY = (fromSpot.y + toSpot.y) / 2;
      const methodLabel = getTravelMethodLabel(segment.travelMethod);
      const timeLabel = formatTravelTime(segment.travelTime);

      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${methodLabel} (${timeLabel})`, midX, midY - 10);

      // 距離を表示
      ctx.fillText(`${segment.distance.toFixed(1)}km`, midX, midY + 10);
    }

    // スポットを描画
    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];

      // 円を描画
      ctx.fillStyle = i === 0 ? '#4CAF50' : i === spots.length - 1 ? '#F44336' : '#2196F3';
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // スポット番号を描画
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((i + 1).toString(), spot.x, spot.y);

      // スポット名を描画
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'top';
      ctx.fillText(spot.name, spot.x, spot.y + radius + 5);
    }

  }, [travelRoute]);

  return (
    <div className={styles.routeMapContainer}>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className={styles.routeMapCanvas}
      />
      <div className={styles.routeMapLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#4CAF50' }}></div>
          <div className={styles.legendLabel}>徒歩</div>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#2196F3' }}></div>
          <div className={styles.legendLabel}>車</div>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#F44336' }}></div>
          <div className={styles.legendLabel}>電車</div>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#FF9800' }}></div>
          <div className={styles.legendLabel}>自転車</div>
        </div>
      </div>
      <div className={styles.routeMapInfo}>
        <div className={styles.routeMapInfoItem}>
          <span className={styles.infoLabel}>総移動距離:</span>
          <span className={styles.infoValue}>{travelRoute.totalDistance.toFixed(1)}km</span>
        </div>
        <div className={styles.routeMapInfoItem}>
          <span className={styles.infoLabel}>総移動時間:</span>
          <span className={styles.infoValue}>{formatTravelTime(travelRoute.totalTravelTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
