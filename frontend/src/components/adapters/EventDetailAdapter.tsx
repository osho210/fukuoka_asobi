'use client';

import { ReactNode } from 'react';
import { Event } from '../../types/event';
import ContentDetail from '../ContentDetail';
import { formatDateRange } from '../../lib/dateUtils';
import '@styles/ContentDetail.css';

type EventDetailAdapterProps = {
  event: Event;
};

/**
 * イベント詳細をContentDetailコンポーネントに適応させるアダプター
 */
export default function EventDetailAdapter({ event }: EventDetailAdapterProps) {
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
    <button className="content-detail-button">
      シェアする
    </button>
  );

  return (
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
  );
}
