'use client';

import { PlayPlan } from '@/types/plan';
import PlanHeader from './plan/PlanHeader';
import PlanRecommendation from './plan/PlanRecommendation';
import PlanStats from './plan/PlanStats';
import PlanStepList from './plan/PlanStepList';
import PlanTotalBudget from './plan/PlanTotalBudget';
import PlanActions from './plan/PlanActions';
import { PlanImages } from './plan/PlanImages'
import { PlanTags } from './plan/PlanTag';

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

      <div className="plan-details-section">
        <h2 className="plan-details-title">プラン詳細</h2>
        <PlanStepList plan={plan} />
      </div>

      <PlanTotalBudget totalBudget={plan.totalBudget} />
      <PlanActions plan={plan} showFavorite={true} showShare={true} />
    </div>
  );
};

export default PlayPlanDetail;
