'use client';

import { ReactNode } from 'react';
import { Spot } from '../../types/spot';
import ContentDetail from '../ContentDetail';
import BusinessHours from '../BusinessHours';
import '@styles/ContentDetail.css';

type SpotDetailAdapterProps = {
  spot: Spot;
};

/**
 * スポット詳細をContentDetailコンポーネントに適応させるアダプター
 */
export default function SpotDetailAdapter({ spot }: SpotDetailAdapterProps) {
  // バッジ要素の作成
  const badges: ReactNode = (
    <>
      <span className="content-detail-badge">
        {spot.spotType}
      </span>
      {spot.isClosed && (
        <span className="content-detail-badge" style={{ backgroundColor: '#ff4d4d', color: 'white' }}>
          閉店
        </span>
      )}
    </>
  );

  // メインセクションの作成
  const mainSections = [];

  // 説明文
  if (spot.catchphrase) {
    mainSections.push({
      title: '詳細情報',
      content: <p>{spot.catchphrase}</p>
    });
  }

  // 場所情報
  mainSections.push({
    title: '場所',
    content: (
      <>
        <p className="content-detail-location">
          <span className="content-detail-icon">📍</span>
          {spot.district.districtName} / {spot.areas.map(area => area.areaName).join(', ')}
        </p>
        <p>{spot.address}</p>
        {spot.nearestStation && <p>最寄駅: {spot.nearestStation}</p>}
      </>
    )
  });

  // カテゴリ情報
  if (spot.categories && spot.categories.length > 0) {
    mainSections.push({
      title: 'カテゴリ',
      content: (
        <ul className="content-detail-list">
          {spot.categories.map(category => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )
    });
  }

  // 営業時間
  mainSections.push({
    title: '営業時間',
    content: <BusinessHours spot={spot} />
  });

  // メニュー情報
  if (spot.menus && spot.menus.length > 0) {
    mainSections.push({
      title: 'メニュー',
      content: (
        <ul className="content-detail-list">
          {spot.menus.map(menu => (
            <li key={menu.id}>
              <strong>{menu.menuName}</strong>
              {menu.price && <span> - ¥{menu.price.toLocaleString()}</span>}
              {menu.description && <p>{menu.description}</p>}
            </li>
          ))}
        </ul>
      )
    });
  }

  // ハッシュタグ
  if (spot.hashtags && spot.hashtags.length > 0) {
    mainSections.push({
      title: 'ハッシュタグ',
      content: (
        <div className="content-detail-tags">
          {spot.hashtags.map(tag => (
            <span key={tag.id} className="content-detail-tag">
              {tag.hashtagName}
            </span>
          ))}
        </div>
      )
    });
  }

  // サイドバー項目の作成
  const sidebarItems = [];

  // 評価
  sidebarItems.push({
    label: '評価',
    content: (
      <div className="rating">
        <span className="stars">★ {spot.reviewRating?.toFixed(1) || '0.0'}</span>
        <span className="review-count">({spot.reviewCount || 0}件のレビュー)</span>
      </div>
    )
  });

  // 連絡先
  if (spot.phoneNumber || spot.website || spot.instagramUrl) {
    sidebarItems.push({
      label: '連絡先',
      content: (
        <>
          {spot.phoneNumber && (
            <p className="content-detail-contact">
              <span className="content-detail-icon">📞</span>
              <a href={`tel:${spot.phoneNumber}`} className="content-detail-link">
                {spot.phoneNumber}
              </a>
            </p>
          )}
          {spot.website && (
            <p className="content-detail-contact">
              <span className="content-detail-icon">🌐</span>
              <a href={spot.website} target="_blank" rel="noopener noreferrer" className="content-detail-link">
                ウェブサイト
              </a>
            </p>
          )}
          {spot.instagramUrl && (
            <p className="content-detail-contact">
              <span className="content-detail-icon">📷</span>
              <a href={spot.instagramUrl} target="_blank" rel="noopener noreferrer" className="content-detail-link">
                Instagram
              </a>
            </p>
          )}
        </>
      )
    });
  }

  // 特徴
  const features = [];
  if (spot.parkingAvailable) features.push('駐車場あり');
  if (spot.isRainyOk) features.push('雨天OK');
  if (spot.budgetRange) features.push(`予算: ${spot.budgetRange}`);
  if (spot.theme) features.push(`テーマ: ${spot.theme}`);

  if (features.length > 0) {
    sidebarItems.push({
      label: '特徴',
      content: (
        <ul className="content-detail-list">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      )
    });
  }

  // おすすめ対象
  if (spot.recommendedFor1 || spot.recommendedFor2) {
    const recommended = [];
    if (spot.recommendedFor1) recommended.push(spot.recommendedFor1);
    if (spot.recommendedFor2) recommended.push(spot.recommendedFor2);

    sidebarItems.push({
      label: 'おすすめ対象',
      content: (
        <ul className="content-detail-list">
          {recommended.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
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
      title={spot.spotName}
      imageUrl={spot.imageUrl}
      badges={badges}
      mainSections={mainSections}
      sidebarItems={sidebarItems}
      backLink="/spots"
      backLinkText="スポット一覧に戻る"
      actions={actions}
    />
  );
}
