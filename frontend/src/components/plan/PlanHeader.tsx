'use client';

import Image from 'next/image';
import { PlayPlan } from '@/__generated__/graphql';
import { formatDate, getTripTypeText } from '@/utils/dateUtils';

interface PlanHeaderProps {
  plan: PlayPlan;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({ plan }) => {
  return (
    <div className="plan-header">

      <p className='catch-copy'>{plan.catchCopy}</p>
      <h1 className="plan-title">{plan.planName}</h1>
      {plan.subtitle && <p className="plan-subtitle">{plan.subtitle}</p>}


      {plan.imageUrls && (
        <div className="plan-image-container">
          <Image
            src={plan.imageUrls ? `${plan.imageUrls[0].url}` : '/no-image.png'}
            alt={plan.planName}
            fill
            className="plan-image"
          />
        </div>
      )}

      {/* メタ情報 */}
      <div className="plan-meta">
        <span className='plan-header-tag'>{getTripTypeText(plan.tripType)}</span>
        {plan.location && (
          <div className="plan-meta-item">
            <span className="plan-meta-icon">
              <Image src={`/fukuoka_map.svg`} alt="Location Icon" width={24} height={24} />
            </span>
            <span>{plan.location}</span>
          </div>
        )}
        {plan.totalBudget && (
          <div className="plan-meta-item">
            <span className="plan-meta-icon"><Image src={`/money-icon.png`} alt="Location Icon" width={24} height={24} /></span>
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

      {plan.leadText && <p className='plan-lead-text'>{plan.leadText}</p>}
      <p className='plan-description'>{plan.description}</p>


      <div className='plan-planner-container'>
        {plan.user && (
          <div className="plan-user-info">
            <Image
              className="plan-user-image"
              src={plan.user.avatarUrl ? `/${plan.user.avatarUrl}` : `/${plan.imageUrls}`}
              alt={`${plan.user.username}のプロフィール画像`}
              width={50}
              height={50}
            />
            <div className="plan-user-details">
              <p>プランナー</p>
              <p>
                <span className="plan-user-name">{plan.user.username}</span>
                {plan.user.role === 'editor' && (
                  <span className="plan-user-role">編集部スタッフ</span>
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
          <p className="plan-planner-description">
            {plan.plannerDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlanHeader;
