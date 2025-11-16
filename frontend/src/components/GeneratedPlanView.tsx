'use client';

import React from 'react';
import { GeneratedPlan } from '@/__generated__/graphql';
import { formatTime, formatTravelTime } from '@/utils/dateUtils';
import PlanTimeline from './PlanTimeline';
import RouteMap from './RouteMap';
import '@/styles/GeneratedPlan.css';
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
    <div className="generatedPlanContainer">
      <div className="planHeader">
        <h1 className="planTitle">{plan.planName}</h1>
        <p className="planDescription">{plan.description}</p>
        <div className="planMeta">
          <div className="planMetaItem">
            <span className="metaLabel">日時:</span>
            <span className="metaValue">
              {formatTime(plan.startDatetime)} 〜 {formatTime(plan.endDatetime)}
            </span>
          </div>
          <div className="planMetaItem">
            <span className="metaLabel">予算:</span>
            <span className="metaValue">{plan.totalBudget.toLocaleString()}円</span>
          </div>
          <div className="planMetaItem">
            <span className="metaLabel">総移動時間:</span>
            <span className="metaValue">{formatTravelTime(plan.travelRoute.totalTravelTime)}</span>
          </div>
          <div className="planMetaItem">
            <span className="metaLabel">総移動距離:</span>
            <span className="metaValue">{plan.travelRoute.totalDistance.toFixed(1)}km</span>
          </div>
        </div>
      </div>

      <div className="planContent">
        <div className="timelineSection">
          <h2 className="sectionTitle">プランタイムライン</h2>
          <PlanTimeline planDetails={plan.planDetails} />
        </div>

        <div className="mapSection">
          <h2 className="sectionTitle">ルートマップ</h2>
          <RouteMap travelRoute={plan.travelRoute} />
        </div>

        <div className="detailsSection">
          <h2 className="sectionTitle">スポット詳細</h2>
          <div className="spotsList">
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
