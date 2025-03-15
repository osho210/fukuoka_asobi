'use client';

import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';

// GraphQLクエリの定義
const GET_PLAY_PLANS = gql`
  query GetPlayPlans($limit: Int) {
    playPlans(limit: $limit) {
      id
      planName
      description
      imageUrl
      location
      tripType
      totalBudget
      rating
      reviewCount
      favoriteCount
      status
      user {
        id
        username
        profileImageUrl
        role
      }
    }
  }
`;

// ユーザーの型定義
interface User {
  id: string;
  username: string;
  profileImageUrl: string;
  role: string;
}

// プランの型定義
interface PlayPlan {
  id: string;
  planName: string;
  description?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  tripType?: string | null;
  totalBudget?: number | null;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  status: string;
  user?: User | null;
}

const PlayPlanList = () => {
  const { loading, error, data } = useQuery(GET_PLAY_PLANS, {
    variables: { limit: 5 },
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data || !data.playPlans || data.playPlans.length === 0) return <p>プランが見つかりません</p>;

  return (
    <div className="play-plan-list">
      {data.playPlans.map((plan: PlayPlan) => (
        <Link href={`/plans/${plan.id}`} key={plan.id} className="play-plan-item">
          <div className="play-plan-card">
            <div className="play-plan-meta">
              {plan.location && <span className="plan-location">{plan.location}</span>}
              {plan.tripType && <span className="plan-type">{plan.tripType}</span>}
              {plan.totalBudget && (
                <span className="plan-budget">予算: ¥{plan.totalBudget.toLocaleString()}</span>
              )}
            </div>
            <div className="play-plan-image">
              {plan.imageUrl ? (
                <Image
                  src={plan.imageUrl.startsWith('/') ? plan.imageUrl : `/${plan.imageUrl}`}
                  alt={plan.planName}
                  width={300}
                  height={200}
                  className="plan-image"
                />
              ) : (
                <div className="plan-image-placeholder">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className="play-plan-content">
              <h3 className="play-plan-title">{plan.planName}</h3>
              <p className="play-plan-description">
                {plan.description && plan.description.length > 100
                  ? `${plan.description.substring(0, 100)}...`
                  : plan.description}
              </p>
              <div className="play-plan-stats">
                <span className="plan-rating">★ {plan.rating.toFixed(1)}</span>
                <span className="plan-reviews">({plan.reviewCount}件のレビュー)</span>
                <span className="plan-favorites">♡ {plan.favoriteCount}</span>
              </div>
              <div className='play-plan-user-info'>
                {/* TODO: 画像の差し替え対応はやる必要あり */}
                {/* 一旦画像のurlを静的に指定している */}
                <Image
                  className='plan-user-image'
                  // src={plan.user?.profileImageUrl ?? `/itoshima.png`}
                  src={`/itoshima.png`}
                  alt={`${plan.user?.username ?? "ユーザー"}アイコン`}
                  width={30}
                  height={30}
                />
                <p>
                  {plan.user && (
                    <div className="play-plan-user">
                      <span className="plan-user-name">{plan.user.username}</span>
                      {plan.user.role === 'editor' && (
                        <span className="plan-user-role editor">編集部</span>
                      )}
                      {plan.user.role === 'admin' && (
                        <span className="plan-user-role admin">管理者</span>
                      )}
                    </div>
                  )}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PlayPlanList;
