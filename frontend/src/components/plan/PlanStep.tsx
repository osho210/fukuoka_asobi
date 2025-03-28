'use client';

import { PlanDetail } from '@/types/plan';
import { formatTime, formatTravelTime } from '@/utils/dateUtils';
import SpotDetail from './SpotDetail';
import styles from '@/styles/GeneratedPlan.module.css';
import '../../../public/styles/PlayPlanDetail.css';

interface PlanStepProps {
  detail: PlanDetail;
  isLastStep: boolean;
}

// 移動手段のテキストを取得する関数
const getTravelMethodText = (method: string): string => {
  switch (method.toLowerCase()) {
    case 'walk':
      return '徒歩';
    case 'car':
      return '車';
    case 'train':
      return '電車';
    case 'bus':
      return 'バス';
    case 'bicycle':
      return '自転車';
    default:
      return method;
  }
};

const PlanStep: React.FC<PlanStepProps> = ({ detail, isLastStep }) => {
  return (
    <div className="plan-step">
      <div className="plan-step-timeline">
        <div className="plan-step-number">{detail.stepNumber}</div>
        {!isLastStep && <div className="plan-step-line"></div>}
      </div>
      <div key={detail.id} className={styles.spotCard}>
        <div className="plan-step-content">
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

          <div className={styles.spotInfo}>
            <h3 className={styles.spotName}>
              {detail.stepNumber}. {detail.spot?.spotName}
            </h3>
            <p className={styles.spotCatchphrase}>{detail.spot?.catchphrase}</p>
            <p className={styles.spotAddress}>{detail.spot?.address}</p>
            <div className={styles.spotSchedule}>
              <span className={styles.scheduleTime}>
                {formatTime(detail.startDatetime)} 〜 {formatTime(detail.endDatetime)}
              </span>
              {detail.startDatetime && detail.endDatetime && (
                <span className={styles.scheduleDuration}>
                  （滞在時間: {Math.round(
                    (new Date(detail.endDatetime).getTime() -
                      new Date(detail.startDatetime).getTime()) /
                    60000
                  )}
                  分）
                </span>
              )}
            </div>

            {detail.budget && detail.budget > 0 && (
              <div className={styles.spotBudget}>
                予算: {detail.budget.toLocaleString()}円
              </div>
            )}
            {detail.travelDetails && detail.travelDetails.length > 0 && !isLastStep && (
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
      </div>
    </div>
  );
};

export default PlanStep;
