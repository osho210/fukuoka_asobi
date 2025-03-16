'use client';
import Image from "next/image";
import Link from "next/link";
import HamburgerMenu from '@/components/HamburgerMenu'
import Footer from '@/components/Footer'
import PlayPlanList from '@/components/PlayPlanList'
import RecommendedSpot from '@/components/RecommendedSpot'
import '../../public/styles/common.css';
import '../../public/styles/PlayPlanList.css';
import '../../public/styles/RecommendedSpot.css';

export default function Home() {
  return (
    <div className="container">
      {/* <SpotList /> */}
      <header className="header">
        <h1>
          <Image className="logo" src={'/logo.png'} width={190} height={45} alt="kv" />
        </h1>
        <HamburgerMenu />
      </header>
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
        <p className="section-bubble-title">福岡遊び日記とは？</p>
        <h3 className="section-subheading">ディープな福岡の魅力を多くの人に伝えて、もっと福岡の魅力を伝えたい。</h3>
        <p className="section-content-text">
          福岡遊び日記は、福岡を愛してやまない博多っ子が運営する、ローカル情報メディアです。
          普段の暮らしでは知ることができない、一歩踏み込んだ情報を発信しています。
        </p>
        <Link href={''} className="section-link concept">コンセプトについて</Link>
      </div>
      <div className="section">
        <h2 className="section-title">Editor&apos;s Pick Up Plan</h2>
        <p className="section-subtitle">編集部イチオシプラン</p>
        <PlayPlanList />
        <Link href={''} className="section-link">プラン一覧を見る</Link>
      </div>
      <div className="section">
        <h2 className="section-title">Editor&apos;s Pick Up Spot</h2>
        <p className="section-subtitle">編集部イチオシスポット</p>
        <RecommendedSpot />
        <Link href={''} className="section-link">スポット一覧を見る</Link>
      </div>
      <div className="section">
        <h2 className="section-title">Editor&apos;s Pick Up Event</h2>
        <p className="section-subtitle">編集部イチオシイベント</p>
        {/* <RecommendedEvent /> */}
        <Link href={''} className="section-link">開催中のイベントを見る</Link>
      </div>
      <div className="section">
        <Link href={'https://www.instagram.com/fukuoka___cafe/'}>
          <Image src={'/official-banner.png'} width={392} height={263} alt="official-banner" />
        </Link>
        <p className="section-title">公式SNSでも福岡の情報を発信中！</p>
      </div>
      <div className="section">
        
      </div>
      <Footer />
    </div >
  );
}
