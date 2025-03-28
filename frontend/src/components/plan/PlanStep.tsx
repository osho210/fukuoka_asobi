'use client';

import { PlanDetail } from '@/types/plan';
import { formatTime } from '@/utils/dateUtils';
import SpotDetail from './SpotDetail';

interface PlanStepProps {
  detail: PlanDetail;
  isLastStep: boolean;
}

const PlanStep: React.FC<PlanStepProps> = ({ detail, isLastStep }) => {
  return (
    <div className="plan-step">
      <div className="plan-step-timeline">
        <div className="plan-step-number">{detail.stepNumber}</div>
        {!isLastStep && <div className="plan-step-line"></div>}
      </div>

      <div className="plan-step-content">
        <div className="plan-step-header">
          <h3 className="plan-step-name">{detail.stepName}</h3>
          {detail.createdAt && (
            <div className="plan-step-time">
              {formatTime(detail.createdAt)}
              {detail.endDatetime && ` 〜 ${formatTime(detail.endDatetime)}`}
            </div>
          )}
        </div>

        {detail.stepDescription && (
          <div className="plan-step-description">
            {detail.stepDescription}
          </div>
        )}

        {detail.plannerTitle && (
          <div className="plan-step-planner-title">
            <h4>{detail.plannerTitle}</h4>
          </div>
        )}

        {detail.plannerDescription && (
          <div className="plan-step-planner-description">
            <p>{detail.plannerDescription}</p>
          </div>
        )}

        {detail.comment && (
          <div className="plan-step-comment">
            <p>{detail.comment}</p>
          </div>
        )}

        {detail.spot && <SpotDetail spot={detail.spot} />}

        {detail.budget && (
          <div className="plan-step-budget">
            <span>予算:</span>
            <span className="plan-step-budget-value">¥{detail.budget.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanStep;
