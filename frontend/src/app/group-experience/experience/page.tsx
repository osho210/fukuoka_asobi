'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_EXPERIENCE_CARDS } from '@/graphql/queries/getExperienceCards';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import Image from 'next/image';

interface ExperienceCard {
  id: string;
  title: string;
  body: string;
  truncatedBody: string;
  tags: string[];
  area: string | null;
  duration: number | null;
  timeSlot: string | null;
  active: boolean;
}

export default function ExperiencePage() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<ExperienceCard | null>(null);
  const [savedCards, setSavedCards] = useState<ExperienceCard[]>([]);

  useEffect(() => {
    // セッションストレージから選択されたタグを取得
    const tags = sessionStorage.getItem('selectedTags');
    if (tags) {
      try {
        setSelectedTags(JSON.parse(tags));
      } catch (e) {
        console.error('Failed to parse tags:', e);
      }
    }
  }, []);

  const { loading, error, data } = useQuery(GET_EXPERIENCE_CARDS, {
    variables: {
      tags: selectedTags.length > 0 ? selectedTags : null,
      limit: 5,
    },
    skip: selectedTags.length === 0,
  });

  const cards: ExperienceCard[] = data?.experienceCards || [];

  const handleSelectCard = (card: ExperienceCard) => {
    setSelectedCard(card);
  };

  const handleSaveForLater = (card: ExperienceCard) => {
    const updated = [...savedCards, card];
    setSavedCards(updated);
    // 保留したカードをセッションストレージに保存
    sessionStorage.setItem('savedCards', JSON.stringify(updated));
  };

  const handleShare = () => {
    if (!selectedCard) return;

    const shareText = `
【福岡遊び日記】今日の体験
${selectedCard.title}

${selectedCard.body}

#福岡遊び日記 #福岡
    `.trim();

    if (navigator.share) {
      navigator.share({
        title: '福岡遊び日記 - グループ体験',
        text: shareText,
      }).catch(() => { });
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(shareText);
      alert('テキストをコピーしました！');
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem('selectedTags');
    sessionStorage.removeItem('savedCards');
    router.push('/group-experience');
  };

  if (loading || selectedTags.length === 0) {
    return (
      <div className="experience-container">
        <div className="loading-state">
          <p>体験カードを準備中...</p>
        </div>
      </div>
    );
  }

  if (error || !cards.length) {
    return (
      <div className="experience-container">
        <div className="error-state">
          <p>体験カードの読み込みに失敗しました</p>
          <button onClick={handleReset}>最初からやり直す</button>
        </div>
      </div>
    );
  }

  return (
    <div className="experience-container">
      <div className="experience-header">
        <h1 className="experience-title">体験を選ぶ</h1>
        <p className="experience-subtitle">
          気になる体験を選んでください
        </p>
        {selectedTags.length > 0 && (
          <div className="selected-tags">
            <p>選ばれた方向性：</p>
            <div className="tags-list">
              {selectedTags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedCard ? (
        <div className="selected-card-view">
          <div className="selected-card">
            <h2>{selectedCard.title}</h2>
            <div className="card-meta">
              {selectedCard.area && <span className="meta-item"><Image src="/pin-icon.png" alt="Departure Icon" width={20} height={20} /> {selectedCard.area}</span>}
              {selectedCard.duration && (
                <span className="meta-item">⏱️ 約{selectedCard.duration}分</span>
              )}
              {selectedCard.timeSlot && (
                <span className="meta-item">🕐 {selectedCard.timeSlot}</span>
              )}
            </div>
            <p className="card-body">{selectedCard.body}</p>
          </div>

          <div className="action-buttons">
            <button className="button-share" onClick={handleShare}>
              この体験を共有する
            </button>
            <button className="button-secondary" onClick={handleReset}>
              最初からやり直す
            </button>
          </div>

          {savedCards.length > 0 && (
            <div className="saved-cards-section">
              <h3>保留中の体験（{savedCards.length}件）</h3>
              <div className="saved-cards-list">
                {savedCards.map(card => (
                  <div key={card.id} className="saved-card-item">
                    {card.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map(card => (
            <div key={card.id} className="experience-card">
              <h3 className="card-title">{card.title}</h3>
              <div className="card-meta">
                {card.area && <span className="meta-item"><Image src="/pin-icon.png" alt="Departure Icon" width={20} height={20} /> {card.area}</span>}
                {card.duration && (
                  <span className="meta-item">⏱️ 約{card.duration}分</span>
                )}
              </div>
              <p className="card-description">{card.truncatedBody}</p>
              <div className="card-buttons">
                <button
                  className="button-primary"
                  onClick={() => handleSelectCard(card)}
                >
                  これにする
                </button>
                <button
                  className="button-text"
                  onClick={() => handleSaveForLater(card)}
                >
                  また今度
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .experience-container {
          max-width: ${isDesktop ? '900px' : '100%'};
          margin: 0 auto;
          padding: 2rem 1rem;
          min-height: 70vh;
        }

        .experience-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .experience-title {
          font-size: ${isDesktop ? '2rem' : '1.5rem'};
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .experience-subtitle {
          font-size: ${isDesktop ? '1rem' : '0.9rem'};
          color: #666;
          margin-bottom: 1rem;
        }

        .selected-tags {
          margin-top: 1rem;
        }

        .selected-tags p {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .tags-list {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .tag {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: ${isDesktop ? 'repeat(2, 1fr)' : '1fr'};
          gap: 1.5rem;
        }

        .experience-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .experience-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .card-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          font-size: 0.85rem;
          color: #666;
        }

        .card-description {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .card-body {
          font-size: 1rem;
          color: #555;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .card-buttons {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .button-primary {
          flex: 1;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .button-text {
          padding: 0.5rem;
          font-size: 0.9rem;
          color: #999;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
        }

        .button-text:hover {
          color: #666;
        }

        .selected-card-view {
          max-width: 700px;
          margin: 0 auto;
        }

        .selected-card {
          background: white;
          border-radius: 16px;
          padding: ${isDesktop ? '3rem' : '2rem'};
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          margin-bottom: 2rem;
        }

        .selected-card h2 {
          font-size: ${isDesktop ? '2rem' : '1.5rem'};
          font-weight: bold;
          color: #333;
          margin-bottom: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .button-share {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: bold;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .button-share:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
        }

        .button-secondary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: bold;
          color: #666;
          background: white;
          border: 2px solid #ddd;
          border-radius: 50px;
          cursor: pointer;
        }

        .button-secondary:hover {
          background: #f5f5f5;
        }

        .saved-cards-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #eee;
        }

        .saved-cards-section h3 {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 1rem;
          text-align: center;
        }

        .saved-cards-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .saved-card-item {
          padding: 0.75rem 1rem;
          background: #f9f9f9;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #555;
        }

        .loading-state,
        .error-state {
          text-align: center;
          padding: 3rem;
        }

        .error-state button {
          margin-top: 1rem;
          padding: 0.8rem 2rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
