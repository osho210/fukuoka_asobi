'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/EventsPage.css';
import '@/styles/RecommendedSpot.css';

// 共通のセクション型定義
type Section = {
  title: string;
  content: ReactNode;
};

// サイドバー項目の型定義
type SidebarItem = {
  label: string;
  content: ReactNode;
};

type ImageUrl = {
  id: string;
  url: string;
};

// 詳細ページの共通プロパティ
type ContentDetailProps = {
  // 基本情報
  title: string;
  imageUrls?: ImageUrl[] | null;
  badges?: ReactNode;

  // メインコンテンツ
  mainSections: Section[];

  // サイドバー
  sidebarItems: SidebarItem[];

  // ナビゲーション
  backLink: string;
  backLinkText: string;

  // アクション
  actions?: ReactNode;
};

/**
 * 汎用的なコンテンツ詳細表示コンポーネント
 * イベント、スポット、ニュースなど様々なコンテンツタイプに対応
 */
export default function ContentDetail({
  title,
  imageUrls,
  badges,
  mainSections,
  sidebarItems,
  backLink,
  backLinkText,
  actions
}: ContentDetailProps) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className="content-detail-container">
      <div className="mb-4">
        <Link href={backLink} className="section-link">
          ← {backLinkText}
        </Link>
      </div>

      <div className="content-detail">
        {/* ヘッダー部分 */}
        <div className="content-detail-header">
          <h1 className="content-detail-title">{title}</h1>
          {badges && <div className="content-detail-badges">{badges}</div>}
        </div>

        <div className="content-detail-grid">
          {/* メインコンテンツ */}
          <div className="content-detail-main">
            {/* 画像 */}
            {/* 登録されている画像が2枚以上ならスライド表示、1枚の場合は単体表示 */}
            {imageUrls && imageUrls.length > 0 ? (
              <div className="content-detail-image">
                {imageUrls.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {imageUrls.map((imageUrl, idx) => (
                      <div key={idx} className="content-detail-slide">
                        <Image
                          src={imageUrl.url}
                          alt={`${title} ${idx + 1}`}
                          width={400}
                          height={200}
                          className="content-detail-image-content"
                          priority={idx === 0}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <Image
                    src={imageUrls[0].url}
                    alt={title}
                    width={800}
                    height={400}
                    className="content-detail-image-content"
                    priority
                  />
                )}
              </div>
            ) : (
              // 画像が設定されていない場合はプレースホルダーを表示
              <div className="content-detail-no-image">
                <span className="image-placeholder">No Image</span>
              </div>
            )}

            {/* セクション */}
            {mainSections.map((section, index) => (
              <div key={index} className="content-detail-section" data-section-title={section.title}>
                <h2 className="content-detail-section-title">{section.title}</h2>
                <div className="content-detail-section-content">{section.content}</div>
              </div>
            ))}
          </div>

          {/* サイドバー */}
          <div className="content-detail-sidebar">
            <div className="content-detail-sidebar-content">
              {sidebarItems.map((item, index) => (
                <div key={index} className="content-detail-sidebar-item">
                  <h3 className="content-detail-sidebar-label">{item.label}</h3>
                  <div>{item.content}</div>
                </div>
              ))}
            </div>

            {/* アクションボタン */}
            {actions && (
              <div className="content-detail-buttons">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
