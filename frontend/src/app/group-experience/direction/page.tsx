'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_DIRECTION_CARDS } from '@/graphql/queries/getDirectionCards';
import { useIsDesktop } from '@/hooks/useMediaQuery';

interface DirectionCard {
  id: string;
  text: string;
  tags: string[];
  weight: number;
  active: boolean;
}

export default function DirectionPage() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewedCards, setViewedCards] = useState(0);
  const maxCards = 3;

  const { loading, error, data } = useQuery(GET_DIRECTION_CARDS, {
    variables: { limit: maxCards },
  });

  const cards: DirectionCard[] = data?.directionCards || [];
  const currentCard = cards[currentCardIndex];

  const handleResponse = (isMatch: boolean) => {
    if (isMatch && currentCard) {
      // 「これは合う」を選択した場合、タグを保存
      setSelectedTags(prev => [...new Set([...prev, ...(currentCard.tags || [])])]);
    }

    // 次のカードへ
    const nextIndex = currentCardIndex + 1;
    const nextViewedCards = viewedCards + 1;

    if (nextViewedCards >= maxCards || nextIndex >= cards.length) {
      // 最大表示数に達したら体験カード選択へ
      sessionStorage.setItem('selectedTags', JSON.stringify(selectedTags));
      router.push('/group-experience/experience');
    } else {
      setCurrentCardIndex(nextIndex);
      setViewedCards(nextViewedCards);
    }
  };

  if (loading) {
    return (
      <div className="direction-container">
        <div className="loading-state">
          <p>カードを準備中...</p>
        </div>
      </div>
    );
  }

  if (error || !cards.length) {
    return (
      <div className="direction-container">
        <div className="error-state">
          <p>カードの読み込みに失敗しました</p>
          <button onClick={() => router.push('/group-experience')}>
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="direction-container">
      <div className="direction-header">
        <h1 className="direction-title">方向性を揃える</h1>
        <p className="direction-subtitle">
          今日の気分に合うものを選んでください
        </p>
        <div className="direction-progress">
          {viewedCards + 1} / {maxCards}
        </div>
      </div>

      {currentCard && (
        <div className="direction-card-wrapper">
          <div className="direction-card">
            <p className="direction-card-text">{currentCard.text}</p>
          </div>

          <div className="direction-buttons">
            <button
              className="button-secondary"
              onClick={() => handleResponse(false)}
            >
              今日は違う
            </button>
            <button
              className="button-primary"
              onClick={() => handleResponse(true)}
            >
              これは合う
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .direction-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem 1rem;
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .direction-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .direction-title {
          font-size: ${isDesktop ? '2rem' : '1.5rem'};
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .direction-subtitle {
          font-size: ${isDesktop ? '1rem' : '0.9rem'};
          color: #666;
          margin-bottom: 1rem;
        }

        .direction-progress {
          font-size: 0.9rem;
          color: #999;
          font-weight: 500;
        }

        .direction-card-wrapper {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .direction-card {
          background: white;
          border-radius: 16px;
          padding: ${isDesktop ? '4rem 3rem' : '3rem 2rem'};
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          margin-bottom: 2rem;
          min-height: ${isDesktop ? '200px' : '150px'};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .direction-card-text {
          font-size: ${isDesktop ? '1.5rem' : '1.2rem'};
          line-height: 1.8;
          text-align: center;
          color: #333;
          font-weight: 500;
        }

        .direction-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .button-primary,
        .button-secondary {
          padding: ${isDesktop ? '1rem 2.5rem' : '0.9rem 2rem'};
          font-size: ${isDesktop ? '1.1rem' : '1rem'};
          font-weight: bold;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .button-primary {
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
        }

        .button-secondary {
          color: #666;
          background: white;
          border: 2px solid #ddd;
        }

        .button-secondary:hover {
          background: #f5f5f5;
          border-color: #ccc;
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
