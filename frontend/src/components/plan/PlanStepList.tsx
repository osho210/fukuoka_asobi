'use client';

import { PlayPlan } from '@/__generated__/graphql';
import PlanStep from './PlanStep';

interface PlanStepListProps {
  plan: PlayPlan;
}

const PlanStepList: React.FC<PlanStepListProps> = ({ plan }) => {
  if (!plan.planDetails || plan.planDetails.length === 0) {
    return <p>プラン詳細はまだ登録されていません。</p>;
  }

  return (
    <div className="plan-steps">
      {plan.planDetails.map((detail, index) => (
        <PlanStep
          key={detail.id}
          detail={detail}
          isLastStep={index === ((plan.planDetails?.length ?? 0) - 1)}
        />
      ))}
    </div>
  );
};

export default PlanStepList;
