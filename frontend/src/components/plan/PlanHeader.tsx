'use client';

import Image from 'next/image';
import { PlayPlan } from '@/types/plan';
import { formatDate, getTripTypeText } from '@/utils/dateUtils';

interface PlanHeaderProps {
  plan: PlayPlan;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({ plan }) => {
  return (
    <div className="plan-header">
      <span className='plan-header-tag'>{getTripTypeText(plan.tripType)}</span>
      <h1 className="plan-title">{plan.planName}</h1>

      <div className="plan-meta">
        {plan.location && (
          <div className="plan-meta-item">
            <span className="plan-meta-icon">📍</span>
            <span>{plan.location}</span>
          </div>
        )}
        {plan.totalBudget && (
          <div className="plan-meta-item">
            <span className="plan-meta-icon">💰</span>
            <span>予算: ¥{plan.totalBudget.toLocaleString()}</span>
          </div>
        )}
        {plan.createdAt && (
          <div className="plan-meta-item">
            <span className="plan-meta-icon">📅</span>
            <span>作成日: {formatDate(plan.createdAt)}</span>
          </div>
        )}
      </div>

      {plan.imageUrl && (
        <div className="plan-image-container">
          <Image
            src={plan.imageUrl.startsWith('/') ? plan.imageUrl : `/${plan.imageUrl}`}
            alt={plan.planName}
            fill
            className="plan-image"
          />
        </div>
      )}

      {plan.user && (
        <div className="plan-user-info">
          <Image
            className="plan-user-image"
            // TODO: seedにデータを登録していないため、一旦固定の画像を表示
            src={plan.user.profileImageUrl ? `/${plan.user.profileImageUrl}` : `/${plan.imageUrl}`}
            alt={`${plan.user.username}のプロフィール画像`}
            width={50}
            height={50}
          />
          <div className="plan-user-details">
            <p>プランナー</p>
            <p>
              <span className="plan-user-name">{plan.user.username}</span>
              {plan.user.role === 'editor' && (
                <span className="plan-user-role">編集部</span>
              )}
              {plan.user.role === 'admin' && (
                <span className="plan-user-role">管理者</span>
              )}
            </p>
          </div>
        </div>
      )}

      {plan.plannerTitle && (
        <div className="plan-planner-title">
          <h2>{plan.plannerTitle}</h2>
        </div>
      )}

      {plan.plannerDescription && (
        <div className="plan-planner-description">
          {plan.plannerDescription}
        </div>
      )}
    </div>
  );
};

export default PlanHeader;
