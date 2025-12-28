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

const PlayPlanList = () => {

  const { loading, error, data } = useQuery<GetPlayPlansQuery, GetPlayPlansQueryVariables>(GET_PLAY_PLANS, {
    variables: {
      limit: 5,
      isRecommended: true,
    },
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data || !data.playPlans || data.playPlans.length === 0) return <p>プランが見つかりません</p>;

  return (
    <div className='play-plan-list'>
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
            <Link href={`/plans/${plan.id}`} key={plan.id} className="mag-card">
              <article className="mag-card-inner">
                <header className="mag-top">
                  <p className="mag-lead">
                    {plan.leadText}
                  </p>
                  <div className="mag-meta">
                    <span className="mag-price">予算: <br />¥{plan.totalBudget.toLocaleString()}</span>
                    <span className="mag-issue">
                      <span className="mag-issue-number">
                        {new Date(plan.updatedAt).toLocaleString('ja-JP', { month: 'numeric' })}
                      </span>
                    </span>
                  </div>
                </header>
                <div className="mag-title-block">
                  <p className="mag-kicker">{plan.catchCopy}</p>
                  <h3 className="mag-title">
                    {plan.planName}
                  </h3>

                  <p className="mag-subtitle">
                    {plan.subtitle}
                  </p>
                </div>

                <div className="mag-photo">
                  {plan?.imageUrls[0] ? (
                    <Image
                      src={plan.imageUrls[0].url}
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
                <footer className="mag-bottom">
                  <div className="mag-caption">
                    <span className="mag-label">プランナーコメント</span>
                    <p className="mag-caption-title">
                      「{plan.plannerTitle}」
                    </p>
                  </div>
                  <div className="mag-author">
                    <Image
                      src={plan.user?.avatarUrl ?? `/default-image.png`}
                      alt="編集部アイコン"
                      width={15}
                      height={15}
                      className="mag-author-avatar"
                    />

                    <div className="mag-author-meta">
                      <p className="mag-author-name">
                        {plan.user?.username}
                        {plan.user?.role === 'editor' && (
                          <span className="plan-user-role editor">編集部</span>
                        )}
                        {plan.user?.role === 'admin' && (
                          <span className="plan-user-role admin">管理者</span>
                        )}
                      </p>
                    </div>
                  </div>
                </footer>
              </article>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PlayPlanList;
