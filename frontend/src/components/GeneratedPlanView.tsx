'use client';

import React from 'react';
import { GeneratedPlan } from '@/__generated__/graphql';
import { formatTravelTime, formatTime } from '@/utils/dateUtils';
import '@/styles/GeneratedPlan.css';
import '@/styles/PlayPlanDetail.css';
import PlanActions from './plan/PlanActions';
import PlanTotalBudget from './plan/PlanTotalBudget';
import PlanStep from './plan/PlanStep';
import Image from 'next/image';

interface GeneratedPlanViewProps {
  plan: GeneratedPlan;
  onSave?: () => void;
  onEdit?: () => void;
}

const GeneratedPlanView: React.FC<GeneratedPlanViewProps> = ({ plan, onSave, onEdit }) => {
  // 開始時刻から出発時刻を抽出（HH:mm形式にフォーマット）
  const departureTime = formatTime(plan.startTime) || '';

  // 最初のスポットまでの移動情報を取得
  const firstTravelDetail = plan.planDetails[0]?.travelDetails?.[0];
  const travelMethodToFirstSpot = firstTravelDetail?.travelMethod || '徒歩';
  const travelTimeToFirstSpot = firstTravelDetail?.travelTime || 0;

  return (
    <div className="play-plan-detail">
      {/* ヘッダーセクション */}
      <div className="plan-header">
        <h1 className="plan-title">{plan.planName}</h1>
        {plan.description && <p className='plan-description'>{plan.description}</p>}

        {/* メタ情報 */}
        <div className="plan-meta">
          {plan.totalBudget && (
            <div className="plan-meta-item">
              <span className="plan-meta-icon">
                <Image src="/money-icon.png" alt="予算アイコン" width={24} height={24} />
              </span>
              <span>予算: ¥{plan.totalBudget.toLocaleString()}</span>
            </div>
          )}
          {plan.travelRoute.totalTravelTime && (
            <div className="plan-meta-item">
              <span className="plan-meta-icon">⏱️</span>
              <span>総移動時間: {formatTravelTime(plan.travelRoute.totalTravelTime)}</span>
            </div>
          )}
          {plan.travelRoute.totalDistance && (
            <div className="plan-meta-item">
              <span className="plan-meta-icon">📍</span>
              <span>総移動距離: {plan.travelRoute.totalDistance.toFixed(1)}km</span>
            </div>
          )}
        </div>
      </div>

      {/* 出発地点セクション */}
      <div className="plan-departure-section">
        <h2 className='plan-departure-title'>集合 {departureTime}</h2>
        <div className='plan-departure-container'>
          <Image src="/pin-icon.png" alt="出発地点アイコン" width={20} height={20} />
          <p className="plan-departure-location">
            出発地点
          </p>
        </div>
        {firstTravelDetail && (
          <div className='plan-departure-departure-time'>
            <Image src="/dashed-line.svg" alt="矢印アイコン" width={20} height={20} />
            <p>{travelMethodToFirstSpot}で{travelTimeToFirstSpot}分</p>
          </div>
        )}
      </div>

      {/* プラン詳細セクション */}
      <div className="plan-details-section">
        <div className="plan-steps">
          {plan.planDetails.map((detail, index) => (
            <PlanStep
              key={detail.id}
              detail={detail}
              isLastStep={index === plan.planDetails.length - 1}
            />
          ))}
        </div>
      </div>

      {/* 総予算 */}
      <PlanTotalBudget totalBudget={plan.totalBudget || 0} />

      {/* アクション */}
      <PlanActions onSave={onSave} onEdit={onEdit} showFavorite={false} showShare={false} />
    </div>
  );
};

export default GeneratedPlanView;
