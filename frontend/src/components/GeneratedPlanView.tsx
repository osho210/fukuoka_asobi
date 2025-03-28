'use client';

import React from 'react';
import { GeneratedPlan } from '@/types/plan';
import { formatTime, formatTravelTime, getTravelMethodText } from '@/utils/dateUtils';
import PlanTimeline from './PlanTimeline';
import RouteMap from './RouteMap';
import styles from '@/styles/GeneratedPlan.module.css';
import Image from 'next/image';
import PlanActions from './plan/PlanActions';
import PlanTotalBudget from './plan/PlanTotalBudget';

interface GeneratedPlanViewProps {
  plan: GeneratedPlan;
  onSave?: () => void;
  onEdit?: () => void;
}

const GeneratedPlanView: React.FC<GeneratedPlanViewProps> = ({ plan, onSave, onEdit }) => {
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
                  {detail.spot?.imageUrl ? (
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
                  <h3 className={styles.spotName}>{detail.stepNumber}. {detail.spot?.spotName}</h3>
                  <p className={styles.spotCatchphrase}>{detail.spot?.catchphrase}</p>
                  <p className={styles.spotAddress}>{detail.spot?.address}</p>
                  <div className={styles.spotSchedule}>
                    <span className={styles.scheduleTime}>
                      {formatTime(detail.startDatetime)} 〜 {formatTime(detail.endDatetime)}
                    </span>
                    {detail.startDatetime && detail.endDatetime && (
                      <span className={styles.scheduleDuration}>
                        （滞在時間: {Math.round((new Date(detail.endDatetime).getTime() - new Date(detail.startDatetime).getTime()) / 60000)}分）
                      </span>
                    )}
                  </div>
                  {detail.budget && detail.budget > 0 && (
                    <div className={styles.spotBudget}>
                      予算: {detail.budget.toLocaleString()}円
                    </div>
                  )}
                  {detail.travelDetails && detail.travelDetails.length > 0 && (
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

      <PlanTotalBudget totalBudget={plan.totalBudget} />
      <PlanActions onSave={onSave} onEdit={onEdit} showFavorite={false} showShare={false} />
    </div>
  );
};

export default GeneratedPlanView;
