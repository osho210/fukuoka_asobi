'use client';
import Link from 'next/link';
import { useIsDesktop } from '@/hooks/useMediaQuery';

export default function GroupExperiencePage() {
  const isDesktop = useIsDesktop();

  return (
    <div className="group-experience-container">
      <div className="section">
        <h1 className="section-title">友達と遊びを決める</h1>
        <p className="section-subtitle">日常が愛しくなる、遊び心</p>
        
        <div className="group-experience-content">
          <p className="group-experience-description">
            「どこ行く？」の前に、<br />
            <strong>何がしたいか</strong>の方向性を揃えてみませんか？
          </p>
          
          <div className="group-experience-features">
            <div className="feature-item">
              <h3>1. 方向性を揃える</h3>
              <p>カードで今日の気分を共有</p>
            </div>
            <div className="feature-item">
              <h3>2. 体験を選ぶ</h3>
              <p>方向性に合った体験を提案</p>
            </div>
            <div className="feature-item">
              <h3>3. 会話が生まれる</h3>
              <p>決定より、納得感を大切に</p>
            </div>
          </div>

          <div className="group-experience-buttons">
            <Link href="/group-experience/direction" className="button-primary">
              方向をそろえる
            </Link>
          </div>

          <div className="group-experience-note">
            <p>※ この機能は無料でご利用いただけます</p>
            <p>決まらなくても大丈夫。会話のきっかけづくりが目的です。</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .group-experience-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: ${isDesktop ? '2.5rem' : '2rem'};
          font-weight: bold;
          text-align: center;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .section-subtitle {
          font-size: ${isDesktop ? '1.2rem' : '1rem'};
          text-align: center;
          color: #666;
          margin-bottom: 2rem;
        }

        .group-experience-content {
          background: #f9f9f9;
          padding: ${isDesktop ? '3rem' : '2rem'};
          border-radius: 12px;
        }

        .group-experience-description {
          font-size: ${isDesktop ? '1.3rem' : '1.1rem'};
          text-align: center;
          line-height: 1.8;
          margin-bottom: 2.5rem;
          color: #444;
        }

        .group-experience-features {
          display: grid;
          grid-template-columns: ${isDesktop ? 'repeat(3, 1fr)' : '1fr'};
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .feature-item {
          text-align: center;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .feature-item h3 {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .feature-item p {
          font-size: 0.9rem;
          color: #666;
        }

        .group-experience-buttons {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .button-primary {
          display: inline-block;
          padding: 1rem 3rem;
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
        }

        .group-experience-note {
          text-align: center;
          margin-top: 2rem;
        }

        .group-experience-note p {
          font-size: 0.85rem;
          color: #999;
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}
