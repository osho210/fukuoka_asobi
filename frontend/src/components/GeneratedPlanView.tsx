'use client';

import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import PlanTimeline from './PlanTimeline';
import RouteMap from './RouteMap';
import styles from '@/styles/GeneratedPlan.module.css';
import Image from 'next/image';

interface TravelDetail {
  sequenceNumber: number;
  travelMethod: string;
  travelTime: number;
}

interface Spot {
  id: string;
  spotName: string;
  address: string;
  catchphrase: string;
  imageUrl: string;
}

interface PlanDetail {
  id: string;
  stepNumber: number;
  stepName: string;
  stepDescription: string;
  startDatetime: string;
  endDatetime: string;
  budget: number;
  spot: Spot;
  travelDetails: TravelDetail[];
}

interface TravelSegment {
  fromSpot: {
    id: string;
    spotName: string;
  };
  toSpot: {
    id: string;
    spotName: string;
  };
  distance: number;
  travelTime: number;
  travelMethod: string;
}

interface TravelRoute {
  totalDistance: number;
  totalTravelTime: number;
  travelSegments: TravelSegment[];
}

interface GeneratedPlan {
  id: string;
  planName: string;
  description: string;
  totalBudget: number;
  startDatetime: string;
  endDatetime: string;
  planDetails: PlanDetail[];
  travelRoute: TravelRoute;
}

interface GeneratedPlanViewProps {
  plan: GeneratedPlan;
  onSave?: () => void;
  onEdit?: () => void;
}

const GeneratedPlanView: React.FC<GeneratedPlanViewProps> = ({ plan, onSave, onEdit }) => {

  // 時間フォーマット（HH:mm）
  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return format(date, 'HH:mm', { locale: ja });
  };

  // 移動手段の日本語表示
  const getTravelMethodText = (method: string) => {
    const methods: { [key: string]: string } = {
      'walk': '徒歩',
      'car': '車',
      'train': '電車',
      'bicycle': '自転車',
      'other': 'その他'
    };
    return methods[method] || method;
  };

  // 移動時間の表示（分→時間分）
  const formatTravelTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
  };

  return (
    <div className={styles.generatedPlanContainer}>
      <div className={styles.planHeader}>
        <h1 className={styles.planTitle}>{plan.planName}</h1>
        <p className={styles.planDescription}>{plan.description}</p>
        <div className={styles.planMeta}>
          <div className={styles.planMetaItem}>
            <span className={styles.metaLabel}>日時:</span>
            <span className={styles.metaValue}>
              {formatTime(plan.startDatetime)} 〜 {formatTime(plan.endDatetime)}
            </span>
          </div>
          <div className={styles.planMetaItem}>
            <span className={styles.metaLabel}>予算:</span>
            <span className={styles.metaValue}>{plan.totalBudget.toLocaleString()}円</span>
          </div>
          <div className={styles.planMetaItem}>
            <span className={styles.metaLabel}>総移動時間:</span>
            <span className={styles.metaValue}>{formatTravelTime(plan.travelRoute.totalTravelTime)}</span>
          </div>
          <div className={styles.planMetaItem}>
            <span className={styles.metaLabel}>総移動距離:</span>
            <span className={styles.metaValue}>{plan.travelRoute.totalDistance.toFixed(1)}km</span>
          </div>
        </div>
      </div>

      <div className={styles.planContent}>
        <div className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>プランタイムライン</h2>
          <PlanTimeline planDetails={plan.planDetails} />
        </div>

        <div className={styles.mapSection}>
          <h2 className={styles.sectionTitle}>ルートマップ</h2>
          <RouteMap travelRoute={plan.travelRoute} />
        </div>

        <div className={styles.detailsSection}>
          <h2 className={styles.sectionTitle}>スポット詳細</h2>
          <div className={styles.spotsList}>
            {plan.planDetails.map((detail) => (
              <div key={detail.id} className={styles.spotCard}>
                <div className={styles.spotImageContainer}>
                  {detail.spot.imageUrl ? (
                    <Image
                      src={detail.spot.imageUrl}
                      alt={detail.spot.spotName}
                      className={styles.spotImage}
                    />
                  ) : (
                    <div className={styles.spotImagePlaceholder}>
                      画像なし
                    </div>
                  )}
                </div>
                <div className={styles.spotInfo}>
                  <h3 className={styles.spotName}>{detail.stepNumber}. {detail.spot.spotName}</h3>
                  <p className={styles.spotCatchphrase}>{detail.spot.catchphrase}</p>
                  <p className={styles.spotAddress}>{detail.spot.address}</p>
                  <div className={styles.spotSchedule}>
                    <span className={styles.scheduleTime}>
                      {formatTime(detail.startDatetime)} 〜 {formatTime(detail.endDatetime)}
                    </span>
                    <span className={styles.scheduleDuration}>
                      （滞在時間: {Math.round((new Date(detail.endDatetime).getTime() - new Date(detail.startDatetime).getTime()) / 60000)}分）
                    </span>
                  </div>
                  {detail.budget > 0 && (
                    <div className={styles.spotBudget}>
                      予算: {detail.budget.toLocaleString()}円
                    </div>
                  )}
                  {detail.travelDetails.length > 0 && (
                    <div className={styles.travelInfo}>
                      <span className={styles.travelMethod}>
                        次のスポットへ: {getTravelMethodText(detail.travelDetails[0].travelMethod)}
                      </span>
                      <span className={styles.travelTime}>
                        （{formatTravelTime(detail.travelDetails[0].travelTime)}）
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.planActions}>
        {onSave && (
          <button className={styles.saveButton} onClick={onSave}>
            プランを保存
          </button>
        )}
        {onEdit && (
          <button className={styles.editButton} onClick={onEdit}>
            プランを編集
          </button>
        )}
      </div>
    </div>
  );
};

export default GeneratedPlanView;
