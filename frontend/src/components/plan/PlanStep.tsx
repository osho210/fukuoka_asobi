'use client';

import { PlanDetail } from '@/__generated__/graphql';
import { formatTravelTime, formatTime } from '@/utils/dateUtils';
import SpotDetail from './SpotDetail';
import '@/styles/GeneratedPlan.css';
import Image from 'next/image';
import '@/styles/PlayPlanDetail.css';

interface PlanStepProps {
  detail: PlanDetail;
  isLastStep: boolean;
}

interface TravelMethodInfo {
  name: string;
  icon: string;
}

const getTravelMethodInfo = (method: string): TravelMethodInfo => {
  switch (method.toLowerCase()) {
    case '徒歩':
      return { name: '徒歩', icon: '/walk-icon.png' };
    case '車':
      return { name: '車', icon: '/car-icon.png' };
    case '電車':
      return { name: '電車', icon: '/train-icon.png' };
    case 'バス':
      return { name: 'バス', icon: '/bus-icon.png' };
    case '自転車':
      return { name: '自転車', icon: '/bicycle-icon.png' };
    default:
      return { name: method, icon: '/question-icon.png' };
  }
};

const PlanStep: React.FC<PlanStepProps> = ({ detail, isLastStep }) => {
  const travelMethodInfo = detail.travelDetails && detail.travelDetails.length > 0
    ? getTravelMethodInfo(detail.travelDetails[0].travelMethod)
    : null;
  return (
    <>
      <div className="plan-step">
        <div className="plan-step-header">
          {detail.startTime && (
            <div className="plan-step-header-time">
              <p className="plan-step-header-label">到着時間</p>
              <Image src="/watch-icon.png" alt="時計アイコン" width={24} height={24} />
              <p className='plan-step-header-value'>{formatTime(detail.startTime)}</p>
            </div>
          )}
          {detail.durationMinutes && (
            <div className="plan-step-header-time">
              <p className="plan-step-header-label">滞在時間</p>
              <Image src="/stopwatch-icon.png" alt="ストップウォッチアイコン" width={24} height={24} />
              <p className='plan-step-header-value'>{detail.durationMinutes}分</p>
            </div>
          )}
          {detail.budget && detail.budget > 0 && (
            <div className="plan-step-header-time">
              <p className="plan-step-header-label">予算</p>
              <Image src="/money-icon.png" alt="予算アイコン" width={24} height={24} />
              <p className='plan-step-header-value'>¥{detail.budget.toLocaleString()}</p>
            </div>
          )}
        </div>
        {detail.spot && <SpotDetail detail={detail} />}

        <div key={detail.id} className="spotCard">
          <div className="plan-step-content">

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
          </div>
        </div>
      </div>
      <div className="spotInfo">
        {detail.travelDetails && detail.travelDetails.length > 0 && !isLastStep && (
          <div className="travelInfo">
            <Image src="/dashed-line.svg" alt="矢印アイコン" width={20} height={20} />
            <span className="travelMethod">
              {travelMethodInfo?.icon && (
                <>
                  <Image
                    src={travelMethodInfo.icon}
                    alt={travelMethodInfo.name}
                    width={30}
                    height={30}
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  />
                </>
              )}
            </span>
            <span className="travelTime">
              {travelMethodInfo?.name}で{formatTravelTime(detail.travelDetails[0].travelTime)}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default PlanStep;
