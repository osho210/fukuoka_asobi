'use client';

import { PlayPlan } from '@/types/plan';

interface PlanRecommendationProps {
  plan: PlayPlan;
}

const PlanRecommendation: React.FC<PlanRecommendationProps> = ({ plan }) => {
  if ((!plan.recommendedFors || plan.recommendedFors.length === 0) && !plan.recommendedForString) {
    return null;
  }

  return (
    <div className="plan-recommended-for">
      <h3>こんな方におすすめのプラン</h3>
      <div className="plan-recommended-for-tags">
        {plan.recommendedFors ? (
          plan.recommendedFors.map(item => (
            <span key={item.id} className="plan-recommended-for-tag">{item.name}</span>
          ))
        ) : plan.recommendedForString ? (
          plan.recommendedForString.split(',').map((item, index) => (
            <span key={index} className="plan-recommended-for-tag">{item.trim()}</span>
          ))
        ) : null}
      </div>
    </div>
  );
};

export default PlanRecommendation;
