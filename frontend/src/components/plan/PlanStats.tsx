'use client';

import { PlayPlan } from '@/types/plan';

interface PlanStatsProps {
  plan: PlayPlan;
}

const PlanStats: React.FC<PlanStatsProps> = ({ plan }) => {
  return (
    <div className="plan-stats">
      <div className="plan-stat-item">
        <span className="plan-stat-value">★ {plan.rating.toFixed(1)}</span>
        <span className="plan-stat-label">評価</span>
      </div>
      <div className="plan-stat-item">
        <span className="plan-stat-value">{plan.reviewCount}</span>
        <span className="plan-stat-label">レビュー</span>
      </div>
      <div className="plan-stat-item">
        <span className="plan-stat-value">♡ {plan.favoriteCount}</span>
        <span className="plan-stat-label">お気に入り</span>
      </div>
      {/* ここに閲覧数を表示しても面白そう */}
      {/* <div className="plan-stat-item">
        <span className="plan-stat-value">👁️ {viewCount}</span>
        <span className="plan-stat-label">閲覧数</span>
      </div> */}
    </div>
  );
};

export default PlanStats;
