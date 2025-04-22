'use client';
import Image from "next/image";
import Link from "next/link";
import PlayPlanList from '@/components/PlayPlanList'
import RecommendedSpot from '@/components/RecommendedSpot'
import RecommendedEvent from '@/components/RecommendedEvent'
import RecommendedNews from '@/components/RecommendedNews'

export default function Home() {
  return (
    <>
      <div className="image-container">
        <Image src={'/kv.jpg'} width={380} height={700} alt="kv" />
        <p className="vertical-text">
          福岡をもっと楽しく、<br />もっと身近に。
        </p>
      </div>
      <div className="section">
        <h2 className="section-title">福岡って、最高さ。</h2>
        <p className="section-text">
          まだ出会っていないだけで、福岡には最高なお店が眠っている。
          地元の人しか知らない「通」なお店、今までの自分ではいかなかった「一歩背伸び」するお店
          心の琴線に触れるお店探しのお手伝いをするメディアを、あなたと作っていきたい。
        </p>
      </div>
      <div className="section section-content">
        <p className="section-bubble-title">福岡遊び日記日記とは？</p>
        <h3 className="section-subheading">ディープな福岡の魅力を多くの人に伝えて、もっと福岡の魅力を伝えたい。</h3>
        <p className="section-content-text">
          福岡遊び日記日記は、福岡を愛してやまない博多っ子が運営する、ローカル情報メディアです。
          普段の暮らしでは知ることができない、一歩踏み込んだ情報を発信しています。
        </p>
        <Link href={'/about'} className="section-link concept">コンセプトについて</Link>
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
        <Link href={'https://www.instagram.com/fukuoka___cafe/'}>
          <Image src={'/official-banner.png'} width={392} height={263} alt="official-banner" />
        </Link>
        <p className="section-title">公式SNSでも福岡の情報を発信中！</p>
      </div>
      <div className="section news">
        <h2 className="section-title">News</h2>
        <RecommendedNews />
        <Link href={'/news'} className="section-link">ニュース一覧を見る</Link>
      </div>
    </>
  );
}
