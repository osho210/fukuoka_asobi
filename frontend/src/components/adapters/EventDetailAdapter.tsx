'use client';

import { ReactNode } from 'react';
import { Event } from '@/__generated__/graphql';
import ContentDetail from '../ContentDetail';
import { formatDateRange } from '../../lib/dateUtils';
import { shareToLine, copyUrlToClipboard } from '@/utils/shareUtils';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast/ToastContainer';
import '@/styles/ContentDetail.css';
import Image from 'next/image';

type EventDetailAdapterProps = {
  event: Event;
};

/**
 * イベント詳細をContentDetailコンポーネントに適応させるアダプター
 */
export default function EventDetailAdapter({ event }: EventDetailAdapterProps) {
  const { toasts, showToast, removeToast } = useToast();

  // LINEシェアハンドラー
  const handleShareLine = () => {
    shareToLine(event.title);
  };

  // URLコピーハンドラー
  const handleShareCopy = async () => {
    const success = await copyUrlToClipboard();
    if (success) {
      showToast('イベントのURLをコピーしました！', 'success');
    } else {
      showToast('コピーに失敗しました', 'error');
    }
  };

  // バッジ要素の作成
  const badges: ReactNode = (
    <>
      <span className="content-detail-badge">
        {event.eventCategory.name}
      </span>
      {event.isOnline && (
        <span className="content-detail-badge" style={{ backgroundColor: '#cb6b52', color: 'white' }}>
          オンライン
        </span>
      )}
    </>
  );

  // メインセクションの作成
  const mainSections = [
    {
      title: 'イベント詳細',
      content: <p>{event.description}</p>
    },
    {
      title: '開催日時',
      content: (
        <p className="content-detail-datetime">
          <span className="content-detail-icon">📅</span>
          {formatDateRange(new Date(event.startDatetime), new Date(event.endDatetime))}
          {event.recurringRule && (
            <div className="content-detail-recurring">
              繰り返し: {event.recurringRule}
            </div>
          )}
        </p>
      )
    },
    {
      title: '開催場所',
      content: (
        <>
          <p className="content-detail-location">
            <span className="content-detail-icon">📍</span>
            {event.location}
          </p>
          {(event.latitude && event.longitude) && (
            <div className="content-detail-map-container">
              {/* ここに地図を表示 */}
              <div className="content-detail-map-placeholder">
                <span className="content-detail-map-text">地図が表示されます</span>
              </div>
            </div>
          )}
        </>
      )
    }
  ];

  // サイドバー項目の作成
  const sidebarItems = [];

  if (event.price) {
    sidebarItems.push({
      label: '料金',
      content: <p>{event.price}</p>
    });
  }

  if (event.capacity) {
    sidebarItems.push({
      label: '定員',
      content: <p>{event.capacity}人</p>
    });
  }

  if (event.organizer) {
    sidebarItems.push({
      label: '主催者',
      content: <p>{event.organizer}</p>
    });
  }

  // 連絡先情報
  if (event.contactEmail || event.contactPhone) {
    sidebarItems.push({
      label: 'お問い合わせ',
      content: (
        <>
          {event.contactEmail && (
            <p className="content-detail-contact">
              <span className="content-detail-icon">✉️</span>
              <a href={`mailto:${event.contactEmail}`} className="content-detail-link">
                {event.contactEmail}
              </a>
            </p>
          )}
          {event.contactPhone && (
            <p className="content-detail-contact">
              <span className="content-detail-icon">📞</span>
              <a href={`tel:${event.contactPhone}`} className="content-detail-link">
                {event.contactPhone}
              </a>
            </p>
          )}
        </>
      )
    });
  }

  // 公式サイト
  if (event.sourceUrl) {
    sidebarItems.push({
      label: '公式サイト',
      content: (
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="content-detail-external-link"
        >
          <span className="content-detail-icon">🔗</span>
          公式サイトを見る
        </a>
      )
    });
  }

  // アクションボタン
  const actions = (
    <div className="content-detail-actions">
      <button className="bucket-share-button bucket-share-line" onClick={handleShareLine}>
        <Image src={'/line-icon.png'} width={20} height={20} alt={'line icon'} />
        LINEで送る
      </button>
      <button className="bucket-share-button bucket-share-copy" onClick={handleShareCopy}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        シェアする
      </button>
    </div>
  );

  return (
    <>
      <ContentDetail
        title={event.title}
        imageUrls={[]}
        badges={badges}
        mainSections={mainSections}
        sidebarItems={sidebarItems}
        backLink="/events"
        backLinkText="イベント一覧に戻る"
        actions={actions}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
