'use client';

import { PlayPlan } from '@/__generated__/graphql';
import PlanHeader from './plan/PlanHeader';
import PlanRecommendation from './plan/PlanRecommendation';
import PlanStats from './plan/PlanStats';
import PlanStepList from './plan/PlanStepList';
import PlanTotalBudget from './plan/PlanTotalBudget';
import PlanActions from './plan/PlanActions';
import { PlanImages } from './plan/PlanImages'
import { PlanTags } from './plan/PlanTag';
import Image from 'next/image';

interface PlayPlanDetailProps {
  plan: PlayPlan;
}

const PlayPlanDetail: React.FC<PlayPlanDetailProps> = ({ plan }) => {
  return (
    <div className="play-plan-detail">
      <PlanHeader plan={plan} />
      <PlanRecommendation plan={plan} />
      <PlanStats plan={plan} />
      <PlanImages plan={plan} />
      <PlanTags plan={plan} />

      {/* 出発地点 */}
      <div className="plan-departure-section">
        <h2 className='plan-departure-title'>集合 {plan.departureTime}</h2>
        <div className='plan-departure-container'>
          <Image src="/pin-icon.png" alt="Departure Icon" width={20} height={20} />
          <p className="plan-departure-location">
            {plan.departure}
          </p>
        </div>
        <div className='plan-departure-departure-time'>
          <Image src="/dashed-line.svg" alt="矢印アイコン" width={20} height={20} />
          <p>{plan.travelMethodToFirstSpot} で{plan.travelTimeToFirstSpot}分</p>
        </div>
      </div>
      <div className="plan-details-section">
        <PlanStepList plan={plan} />
      </div>
      <PlanTotalBudget totalBudget={plan.totalBudget} />
      <PlanActions plan={plan} showFavorite={true} showShare={true} />
    </div>
  );
};

export default PlayPlanDetail;
