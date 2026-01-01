'use client';
import Image from "next/image";
import Link from "next/link";
import PlayPlanList from '@/components/PlayPlanList'
import RecommendedSpot from '@/components/RecommendedSpot'
import RecommendedEvent from '@/components/RecommendedEvent'
import RecommendedNews from '@/components/RecommendedNews'
import { useIsDesktop } from '@/hooks/useMediaQuery'


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
      <div className="section section-content">
        <p className="section-bubble-title">福岡遊び日記とは？</p>
        <h3 className="section-subheading">「いつもの福岡」に新しい1ページを。</h3>
        <p className="section-content-text">
          <span>ガ</span>イドブックをなぞるだけでは辿り着けない、
          地元の人に愛され続ける、センスのいい隠れ家。
          知る人ぞ知る誰かに教えたくなる穴場。
          ここを覗けばあなたの「いつもの選択肢」は、
          胸が高鳴るような特別なものへ変わるはず。
          「今までの自分なら選ばなかった」そんなワクワクする瞬間をお届けます。
          今日は昨日よりも少しだけディープで、美しい福岡へ。
        </p>
        <Link href={'/buckets'} className="section-link concept">この街で、やりたい100のこと。</Link>
      </div>
      <div className="section group-experience-promo">
        <h2 className="section-title">「次、ここじゃない？」を形にする</h2>
        <p className="section-subtitle">いつもの遊びに、新しいスパイスを</p>
        <p className="section-content-text">
          ガイドブックには載っていない、私たちだけの隠れ家。<br />
          直感で選ぶプロセスが、今日を特別なものに変えてくれる。<br />
          友達を誘って、新しい一ページをめくりに行こう。
        </p>
        <Link href={'/group-experience'} className="section-link">友達と遊びを企てる</Link>
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
