'use client';

import React from 'react';
import { GeneratedPlan } from '@/types/plan';
import { formatTime, formatTravelTime } from '@/utils/dateUtils';
import PlanTimeline from './PlanTimeline';
import RouteMap from './RouteMap';
import styles from '@/styles/GeneratedPlan.module.css';
import PlanActions from './plan/PlanActions';
import PlanTotalBudget from './plan/PlanTotalBudget';
import PlanStep from '../components/plan/PlanStep';


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
            {plan.planDetails.map((detail, index) => (
              <PlanStep
                key={detail.id}
                detail={detail}
                isLastStep={index === plan.planDetails.length - 1}
              />

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
