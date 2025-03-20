'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import BusinessHours from './BusinessHours';

// 型定義
interface OpeningHour {
  id: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

interface Category {
  id: string;
  name: string;
}

interface District {
  id: string;
  districtName: string;
}

interface Spot {
  id: string;
  spotName: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
  catchphrase?: string;
  reviewRating?: number;
  reviewCount?: number;
  instagramUrl?: string;
  budgetRange?: string;
  imageUrl?: string;
  theme?: string;
  isRainyOk?: boolean;
  district: District;
  categories: Category[];
  openingHours?: OpeningHour[];
  openingHourList?: Array<{
    dayOfWeek: string;
    businessHour: string;
  }>;
  closedDays?: string[];
}

interface PlanDetail {
  id: string;
  stepNumber: number;
  stepName: string;
  stepDescription?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  endDatetime?: string;
  budget?: number;
  notes?: string;
  plannerTitle?: string;
  plannerDescription?: string;
  spot?: Spot;
}

interface User {
  id: string;
  username: string;
  profileImageUrl?: string;
  role: string;
}

interface RecommendedFor {
  id: string;
  name: string;
}

interface PlayPlan {
  id: string;
  planName: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  tripType: string;
  totalBudget?: number;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  status: string;
  startDatetime?: string;
  endDatetime?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string;
  recommendedFors?: RecommendedFor[];
  recommendedForString?: string;
  plannerTitle?: string;
  plannerDescription?: string;
  user?: User;
  planDetails: PlanDetail[];
}

interface PlayPlanDetailProps {
  plan: PlayPlan;
}

// 日付をフォーマットする関数
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'yyyy年MM月dd日', { locale: ja });
  } catch (error) {
    console.error('日付のフォーマットエラー:', error);
    return dateString;
  }
};

// 時間のみをフォーマットする関数
const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'HH:mm', { locale: ja });
  } catch (error) {
    console.error('時間のフォーマットエラー:', error);
    return '';
  }
};

// 旅行タイプを日本語に変換する関数
const getTripTypeText = (tripType: string) => {
  switch (tripType) {
    case 'DAY_TRIP':
      return '日帰り';
    case 'overnight':
      return '泊まり';
    default:
      return tripType;
  }
};

const PlayPlanDetail: React.FC<PlayPlanDetailProps> = ({ plan }) => {
  return (
    <div className="play-plan-detail">
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
              src={plan.imageUrl.startsWith('/') ? `/${plan.imageUrl}` : `/${plan.imageUrl}`}
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
              // src={`/${plan.user.profileImageUrl}`}
              src={`/${plan.imageUrl}`}
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

        {(plan.recommendedFors && plan.recommendedFors.length > 0) || plan.recommendedForString ? (
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
        ) : null}

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
            <span className="plan-stat-value">♡ {plan.favoriteCount}</span>
            <span className="plan-stat-label">お気に入り</span>
          </div> */}
        </div>
      </div>

      <div className="plan-details-section">
        <h2 className="plan-details-title">プラン詳細</h2>

        {plan.planDetails.length > 0 ? (
          <div className="plan-steps">
            {plan.planDetails.map((detail, index) => (
              <div className="plan-step" key={detail.id}>
                <div className="plan-step-timeline">
                  <div className="plan-step-number">{detail.stepNumber}</div>
                  {index < plan.planDetails.length - 1 && <div className="plan-step-line"></div>}
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

                  {detail.spot && (
                    <div className="plan-step-spot">
                      <div className="plan-step-spot-header">
                        <span className="plan-step-spot-name">{detail.spot.spotName}</span>
                      </div>

                      <div className="plan-step-spot-details">
                        {detail.spot.address && (
                          <div className="plan-step-spot-detail">
                            <span>📍</span>
                            <span>{detail.spot.address}</span>
                          </div>
                        )}
                        {detail.spot.phoneNumber && (
                          <div className="plan-step-spot-detail">
                            <span>📞</span>
                            <span>{detail.spot.phoneNumber}</span>
                          </div>
                        )}
                        {detail.spot.budgetRange && (
                          <div className="plan-step-spot-detail">
                            <span>💰</span>
                            <span>{detail.spot.budgetRange}</span>
                          </div>
                        )}
                        {detail.spot.district && (
                          <div className="plan-step-spot-detail">
                            <span>🏙️</span>
                            <span>{detail.spot.district.districtName}</span>
                          </div>
                        )}
                        {detail.spot.isRainyOk !== undefined && (
                          <div className="plan-step-spot-detail">
                            <span>{detail.spot.isRainyOk ? '☂️ 雨OK' : '☔ 雨NG'}</span>
                          </div>
                        )}
                      </div>

                      {detail.spot.imageUrl && (
                        <div className="plan-step-spot-image">
                          <Image
                            src={detail.spot.imageUrl.startsWith('/') ? detail.spot.imageUrl : `/${detail.spot.imageUrl}`}
                            alt={detail.spot.spotName}
                            fill
                            className="spot-image"
                          />
                        </div>
                      )}

                      {detail.spot.categories && detail.spot.categories.length > 0 && (
                        <div className="plan-step-spot-categories">
                          {detail.spot.categories.map(category => (
                            <span key={category.id} className="plan-step-spot-category">
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {detail.spot.openingHourList && detail.spot.openingHourList.length > 0 && (
                        <div className="plan-step-spot-business-hours">
                          <BusinessHours spot={detail.spot} />
                        </div>
                      )}
                    </div>
                  )}

                  {detail.budget && (
                    <div className="plan-step-budget">
                      <span>予算:</span>
                      <span className="plan-step-budget-value">¥{detail.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>プラン詳細はまだ登録されていません。</p>
        )}
      </div>

      {plan.totalBudget && (
        <div className="plan-total-section">
          <h3 className="plan-total-title">合計予算</h3>
          <div className="plan-total-budget">
            <span>¥</span>
            <span className="plan-total-budget-value">{plan.totalBudget.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="plan-actions">
        <button className="plan-action-button primary">
          <span>♡</span>
          <span>お気に入りに追加</span>
        </button>
        <button className="plan-action-button secondary">
          <span>🔗</span>
          <span>シェアする</span>
        </button>
      </div>
    </div>
  );
};

export default PlayPlanDetail;
