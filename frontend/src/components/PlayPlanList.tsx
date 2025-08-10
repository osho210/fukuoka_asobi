'use client';

import { useQuery } from '@apollo/client';
import { GET_PLAY_PLANS, GetPlayPlansQuery, GetPlayPlansQueryVariables } from '@/graphql/playPlans';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import FavoriteButton from './common/FavoriteButton';


const PlayPlanList = () => {

  const { loading, error, data } = useQuery<GetPlayPlansQuery, GetPlayPlansQueryVariables>(GET_PLAY_PLANS, {
    variables: { limit: 5 },
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data || !data.playPlans || data.playPlans.length === 0) return <p>プランが見つかりません</p>;

  return (
    <Swiper
      loop={true}
      modules={[Navigation, Pagination]}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="play-plan-slider"
    >
      {data.playPlans.map((plan) => (
        <SwiperSlide key={plan.id}>
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
                    src={plan.imageUrl.url}
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
                  <div className="plan-favorites-container" onClick={(e) => e.preventDefault()}>
                    <FavoriteButton
                      playPlanId={String(plan.id)}
                      isFavorite={!!plan.isFavorite}
                      size="sm"
                      showText={false}
                      className="plan-favorites-button"
                    />
                    <span className="plan-favorites-count">{plan.favoriteCount}</span>
                  </div>
                </div>
                <div className='play-plan-user-info'>
                  {/* TODO: 画像の差し替え対応はやる必要あり */}
                  {/* 一旦画像のurlを静的に指定している */}
                  <Image
                    className='plan-user-image'
                    // src={plan.user?.profileImageUrl ?? `itoshima.png`}
                    src={`/itoshima.png`}
                    alt={`${plan.user?.username ?? "ユーザー"}アイコン`}
                    width={30}
                    height={30}
                  />
                  <p className="play-plan-user">
                    {plan.user && (
                      <>
                        <span className="plan-user-name">{plan.user.username}</span>
                        {plan.user.role === 'editor' && (
                          <span className="plan-user-role editor">編集部</span>
                        )}
                        {plan.user.role === 'admin' && (
                          <span className="plan-user-role admin">管理者</span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PlayPlanList;
