'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useIsDesktop } from '@/hooks/useMediaQuery';

const ACCENT = '#cb6b52';

const sampleDirectionCards = [
  { title: '今日は、静かめがいい', sub: '言葉を詰め込まない、余白のある時間。' },
  { title: '少しだけ、冒険したい', sub: 'いつもの道から、一本外れてみる。' },
  { title: '観光っぽくない福岡', sub: '地元の人が愛する、素顔の街へ。' },
  { title: '朝を贅沢に使う', sub: '澄んだ空気と、丁寧なコーヒー。' },
  { title: '背伸び、ちょっとだけ', sub: '少しの緊張感と、それ以上の高揚感。' },
];

export default function GroupExperiencePage() {
  const isDesktop = useIsDesktop();
  const [demoIndex, setDemoIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const demoCard = useMemo(() => sampleDirectionCards[demoIndex], [demoIndex]);

  const flipNext = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    window.setTimeout(() => {
      setDemoIndex((prev) => (prev + 1) % sampleDirectionCards.length);
      setIsFlipping(false);
    }, 260);
  };

  return (
    <div className="page">
      <div className="hero">
        <div className="heroLeft">
          <p className="kicker">福岡遊び日記</p>

          <h1 className="title">
            普段とは違う<span className="accent">ワクワクする体験</span>してみない？
          </h1>

          <p className="lead">
            1枚引いて、「それアリだね」を重ねるだけ。<br />
            いつものメンバーで、まだ知らない福岡に出会える。
          </p>

          <div className="ctaRow">
            <Link href="/group-experience/direction" className="primary">
              まず1枚、引いてみる
            </Link>
          </div>
        </div>

        <div className="heroRight">
          {/* Demo card */}
          <div className="demoWrap" onClick={flipNext} style={{ cursor: 'pointer' }}>
            <div className={`demoCard ${isFlipping ? 'flip' : ''}`}>
              <div className="cardTop">
                <span className="brand">福岡遊び日記</span>
                <span className="dot" />
                <span className="line" />
              </div>

              <div className="cardBody">
                <p className="cardTitle">{demoCard.title}</p>
                <p className="cardSub">{demoCard.sub}</p>
              </div>

              <div className="cardBottom">
                <span className="miniLine" />
                <span className="en">STORY DISCOVERY CARD</span>
              </div>
            </div>

            <div className="demoHint">
              <span className="hintDot" />
              <span>カードをタップして今の気分を探す（デモ）</span>
            </div>
          </div>

          {/* Flow chips - 体験ベースの洗練された表現へ */}
          <div className="flow">
            <div className="chip">
              <span className="num">01</span>
              <div>
                <p className="chipTitle">気分をそろえる</p>
                <p className="chipSub">合う / 違う を言うだけ</p>
              </div>
            </div>

            <div className="chip">
              <span className="num">02</span>
              <div>
                <p className="chipTitle">候補をしぼる</p>
                <p className="chipSub">方向に合う体験だけ出す</p>
              </div>
            </div>

            <div className="chip">
              <span className="num">03</span>
              <div>
                <p className="chipTitle">会話で決める</p>
                <p className="chipSub">押しつけず、納得で決まる</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .page {
          max-width: 980px;
          margin: 0 auto;
          padding: ${isDesktop ? '3.5rem 1.25rem' : '2.2rem 1rem'};
        }

        .hero {
          display: grid;
          grid-template-columns: ${isDesktop ? '1.05fr 0.95fr' : '1fr'};
          gap: ${isDesktop ? '2.2rem' : '1.4rem'};
          align-items: start;
        }

        .kicker {
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          color: rgba(0, 0, 0, 0.55);
          margin: 0 0 0.8rem 0;
        }

        .title {
          font-size: ${isDesktop ? '2.4rem' : '1.85rem'};
          line-height: 1.25;
          margin: 0 0 1rem 0;
          color: #151515;
          font-weight: 800;
        }

        .accent {
          color: ${ACCENT};
        }

        .lead {
          font-size: ${isDesktop ? '1.08rem' : '14px'};
          line-height: 1.8;
          margin: 0 0 1.35rem 0;
          color: rgba(0, 0, 0, 0.7);
        }

        .ctaRow {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 1rem;
        }

        .primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.95rem 1.35rem;
          border-radius: 999px;
          background: ${ACCENT};
          color: #fff;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: 0.02em;
          box-shadow: 0 10px 22px rgba(203, 107, 82, 0.24);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(203, 107, 82, 0.32);
        }

        .ghost {
          padding: 0.9rem 1.1rem;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: rgba(255, 255, 255, 0.7);
          color: rgba(0, 0, 0, 0.75);
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .ghost:hover {
          transform: translateY(-1px);
          border-color: rgba(0, 0, 0, 0.22);
        }

        .note {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          color: rgba(0, 0, 0, 0.55);
          font-size: 0.9rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          border: 1px solid rgba(203, 107, 82, 0.35);
          color: ${ACCENT};
          font-weight: 800;
          background: rgba(203, 107, 82, 0.06);
        }

        /* Right side */
        .demoWrap {
          border-radius: 18px;
          padding: 1.25rem;
          background: radial-gradient(
              1200px 400px at 20% 0%,
              rgba(203, 107, 82, 0.14),
              transparent 55%
            ),
            rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .demoCard {
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(0, 0, 0, 0.07);
          box-shadow: 0 18px 36px rgba(0, 0, 0, 0.08);
          padding: 1.1rem 1.05rem 1rem 1.05rem;
          transform-origin: center;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .demoCard.flip {
          transform: rotateY(18deg) scale(0.99);
          opacity: 0.88;
        }

        .cardTop {
          display: grid;
          grid-template-columns: auto 10px 1fr;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.9rem;
        }
        .brand {
          font-weight: 900;
          color: ${ACCENT};
          letter-spacing: 0.02em;
          font-size: 0.95rem;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: ${ACCENT};
          opacity: 0.75;
        }
        .line {
          height: 2px;
          background: rgba(203, 107, 82, 0.35);
          border-radius: 999px;
        }

        .cardBody {
          padding: 0.25rem 0.1rem 1.1rem 0.1rem;
        }
        .cardTitle {
          margin: 0;
          font-size: ${isDesktop ? '1.55rem' : '1.35rem'};
          line-height: 1.25;
          font-weight: 900;
          color: #111;
          letter-spacing: 0.01em;
        }
        .cardSub {
          margin: 0.65rem 0 0 0;
          color: rgba(0, 0, 0, 0.62);
          line-height: 1.7;
          font-size: 0.98rem;
        }

        .cardBottom {
          display: grid;
          grid-template-columns: 80px 1fr;
          align-items: center;
          gap: 0.75rem;
        }
        .miniLine {
          height: 2px;
          background: rgba(203, 107, 82, 0.25);
          border-radius: 999px;
        }
        .en {
          font-weight: 800;
          letter-spacing: 0.14em;
          font-size: 0.8rem;
          color: rgba(0, 0, 0, 0.45);
          text-align: right;
        }

        .demoHint {
          margin-top: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          color: rgba(0, 0, 0, 0.55);
          font-size: 0.88rem;
        }
        .hintDot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: ${ACCENT};
          opacity: 0.55;
        }

        .flow {
          margin-top: 1rem;
          display: grid;
          gap: 0.75rem;
        }

        .chip {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 0.75rem;
          align-items: start;
          padding: 0.9rem 0.95rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .num {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: ${ACCENT};
          background: rgba(203, 107, 82, 0.08);
          border: 1px solid rgba(203, 107, 82, 0.22);
        }

        .chipTitle {
          margin: 0;
          font-weight: 900;
          color: rgba(0, 0, 0, 0.78);
          font-size: 1rem;
        }
        .chipSub {
          margin: 0.25rem 0 0 0;
          color: rgba(0, 0, 0, 0.55);
          font-size: 0.92rem;
          line-height: 1.5;
        }
      `}</style>
    </div >
  );
}
