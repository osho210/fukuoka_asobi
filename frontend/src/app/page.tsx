'use client';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PlayPlanList from '@/components/PlayPlanList'
import RecommendedSpot from '@/components/RecommendedSpot'
import RecommendedEvent from '@/components/RecommendedEvent'
import RecommendedNews from '@/components/RecommendedNews'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import './styles/BucketSlider.css'


export default function Home() {
  const isDesktop = useIsDesktop();

  return (
    <>
      <div className="image-container">
        {isDesktop ? (
          <Image src={'/kv-pc.png'} width={1200} height={400} alt="kv" priority />
        ) : (
          <Image className="kv" src={'/kv.png'} width={360} height={700} alt="kv" priority />
        )}
      </div>
      <div className="section">
        <h2 className="section-title">福岡を、まだ半分も知らない。</h2>
        <p className="section-text">
          <span>正直</span>もう遊び尽くしたと思ってた。でも、この街にはまだ出会っていない物語がそこら中に溢れてる。
          地元の通が夜な夜な集う場所。少しの緊張感と、それ以上の高揚感をくれる<b>背伸び</b>の一軒。
          ここはあなたの日常をワクワクさせる<b>「最高の福岡」と出会うための手引きとなる場所。</b>
        </p>
      </div>
      <div className="section group-experience-promo">
        <h2 className="section-title">FUKUOKA ASOBI DIARY</h2>
        <p className="section-subtitle">あの人の、福岡の楽しみ方。</p>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.bucket-slider-next',
            prevEl: '.bucket-slider-prev',
          }}
          pagination={{ clickable: true }}
          loop={true}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
          className="bucket-slider"
        >
          <SwiperSlide>
            <Image className="bucket-content" src={'/bucket_kv1.png'} alt='福岡でやりたい100のこと' width={250} height={400} />
          </SwiperSlide>
          <SwiperSlide>
            <Image className="bucket-content" src={'/bucket_kv2.png'} alt='福岡でやりたい100のこと' width={250} height={400} />
          </SwiperSlide>
          <SwiperSlide>
            <Image className="bucket-content" src={'/bucket_kv3.png'} alt='福岡でやりたい100のこと' width={250} height={400} />
          </SwiperSlide>
        </Swiper>
        {/* モダンな矢印ナビゲーション */}
        <div className="bucket-slider-prev"></div>
        <div className="bucket-slider-next"></div>
        <Link href={'/buckets'} className="section-link">この街の楽しみ方を、のぞいてみる</Link>
      </div>
      <div className="section">
        <h2 className="section-title">Editor&apos;s Pick Up Plan</h2>
        <p className="section-subtitle">編集部イチオシプラン</p>
        <PlayPlanList />
        <Link href={'/plans'} className="section-link">プラン一覧を見る</Link>
      </div>
      <div className="section">
        <h2 className="section-title">Editor&apos;s Pick Up Spot</h2>
        <p className="section-subtitle">編集部イチオシスポット</p>
        <RecommendedSpot />
        <Link href={'/spots'} className="section-link">スポット一覧を見る</Link>
      </div>
      <div className="section">
        <h2 className="section-title">Editor&apos;s Pick Up Event</h2>
        <p className="section-subtitle">編集部イチオシイベント</p>
        <RecommendedEvent />
        <Link href={'/events'} className="section-link">開催中のイベントを見る</Link>
      </div>
      <div className="section official-sns">
        <Link href="https://www.instagram.com/fukuoka___cafe/" target="_blank">
          <Image
            className="official-banner"
            src="/instagram-banner.png"
            width={392}
            height={263}
            alt="福岡の遊び・カフェ情報を発信するInstagram"
          />
        </Link>

        <p className="section-title">
          今日の「どこ行く？」は公式Instagramで
        </p>
        <p className="section-sub">
          福岡のカフェ・おでかけスポットをリアルタイムで紹介中
        </p>
      </div>

      <div className="section official-sns">
        <Link href="https://fukuoka-cafenikki.com" target="_blank">
          <Image
            className="official-banner"
            src="/official-banner.png"
            width={392}
            height={263}
            alt="福岡カフェ日記｜福岡のカフェ情報メディア"
          />
        </Link>

        <p className="section-title">
          福岡のカフェ探しなら<br></br>「福岡カフェ日記」
        </p>
        <p className="section-sub">
          エリア・シーン別に探せるローカルカフェメディア
        </p>
      </div>

      <div className="section news">
        <h2 className="section-title">News</h2>
        <RecommendedNews />
        <Link href={'/news'} className="section-link">ニュース一覧を見る</Link>
      </div>
    </>
  );
}
