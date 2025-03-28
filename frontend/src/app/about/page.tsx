import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '@styles/AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="hero">
        <div className="hero-content">
          <h1>福岡あそび</h1>
          <p className="subtitle">あなたの週末を特別な体験で彩る、隠れ家スポット提案サービス</p>
        </div>
      </section>

      <section className="concept">
        <div className="container">
          <h2 className="section-title">サービスコンセプト</h2>
          <div className="concept-content">
            <div className="concept-text">
              <p>「福岡あそび」は、週末や休暇のお出かけプランを簡単に立てられることを目的とした<strong>隠れ家スポット提案サービス</strong>です。</p>
              <p>王道の観光地ではなく、地元の人しか知らないような隠れ家カフェや、ディープなローカルスポットを中心に、デート、友人同士、ソロなど、さまざまなシチュエーションに合わせた1日プランをご提案します。</p>
              <p>さらに、天気予報にあわせて屋外/屋内を切り替えられるため、当日「雨が降ってしまった…」という場合も柔軟に対応可能。いつもとは違う、新鮮でユニークなスポットを一日通して楽しめるプランを手軽に見つけられます。</p>
            </div>
            <div className="concept-image">
              <Image
                src="/kv.jpg"
                alt="福岡あそびのコンセプトイメージ"
                width={500}
                height={300}
                className="rounded-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="target">
        <div className="container">
          <h2 className="section-title">こんな方におすすめ</h2>
          <div className="target-cards">
            <div className="target-card">
              <div className="target-icon">
                <Image src="/member_icon.svg" alt="デートプラン" width={60} height={60} />
              </div>
              <h3>デートプランを探している方</h3>
              <p>有名観光地での混雑やワンパターンなデートを避けたい20代男性。&quot;隠れ家&quot;感のある公園やカフェ、夜景スポットなどを、天気に合わせてうまく組み合わせたいという方に。</p>
            </div>
            <div className="target-card">
              <div className="target-icon">
                <Image src="/calendar_icon.svg" alt="週末のディープスポットめぐり" width={60} height={60} />
              </div>
              <h3>週末のディープスポットめぐり</h3>
              <p>地元の王道スポットは行き尽くしたので、よりローカルでディープな店舗やギャラリーを探したい20代後半女性。友人と一緒に「ここ、初めて行ったね！」と盛り上がれるような場所を見つけたい方に。</p>
            </div>
            <div className="target-card">
              <div className="target-icon">
                <Image src="/location_icon.svg" alt="気ままなお散歩プラン" width={60} height={60} />
              </div>
              <h3>気ままなお散歩プラン</h3>
              <p>ひとりでも気軽に行けるカフェや書店、ワークショップなどを巡りたいソロユーザー。予算や気分に合わせてプランをカスタマイズし、マンネリを打破したい方に。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="scenario">
        <div className="container">
          <h2 className="section-title">利用シナリオ例</h2>
          <div className="scenario-tabs">
            <div className="scenario-tab active" id="scenario1">
              <h3>デートプラン</h3>
              <div className="scenario-content">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="time">朝</div>
                    <div className="event">
                      <h4>川沿いの公園で散歩 → 近くの隠れ家カフェへ</h4>
                      <p>朝の清々しい空気の中、二人きりの時間を過ごせる穴場スポットからスタート</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="time">午後</div>
                    <div className="event">
                      <h4>小さなアートギャラリー → レトロな喫茶店</h4>
                      <p>会話が弾む話題が見つかる小さなギャラリーと、ノスタルジックな雰囲気の喫茶店で特別な時間を</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="time">夜</div>
                    <div className="event">
                      <h4>ライトアップされた夜景スポット</h4>
                      <p>地元民しか知らない穴場の夜景スポットで、特別な一日の締めくくり</p>
                    </div>
                  </div>
                </div>
                <div className="weather-note">
                  <p>※ 当日天候が崩れた場合は、屋内スポットが中心の代替プランを自動提案！</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <h2 className="section-title">福岡あそびの4つのメリット</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🏠</div>
              <h3>隠れ家スポットがたくさん</h3>
              <p>有名観光地だけではなく、地元民しか知らない小さなカフェやギャラリーを紹介。</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">☔</div>
              <h3>天気を踏まえた柔軟なプラン</h3>
              <p>事前に晴れ/雨などをチェックし、屋内外を自動で切り替えるので、当日の予定が立てやすい。</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📖</div>
              <h3>1日を通したストーリー性</h3>
              <p>朝から夜までの流れをひとつのプランとして提案。断片的なスポット情報だけではなく、「巡る順番」まで考慮できる。</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🚶</div>
              <h3>ソロでも気軽に</h3>
              <p>カップルや友達同士だけでなく、ひとりでのんびり過ごすプランも作りやすい。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>さあ、いつもと違う福岡の魅力を発見しよう</h2>
          <p>王道観光地では味わえない、特別な体験があなたを待っています</p>
          <Link href="/search" className="cta-button">
            プランを探してみる
          </Link>
        </div>
      </section>

    </div>
  );
}
