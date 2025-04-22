'use client';

import { ReactNode } from 'react';
import { News } from '../../types/news';
import ContentDetail from '../ContentDetail';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import '@styles/ContentDetail.css';
import Image from "next/image";

type NewsDetailAdapterProps = {
  news: News;
};

/**
 * ニュース詳細をContentDetailコンポーネントに適応させるアダプター
 */
export default function NewsDetailAdapter({ news }: NewsDetailAdapterProps) {
  // バッジ要素の作成
  const badges: ReactNode = (
    <>
      {news.category && (
        <span className="content-detail-badge">
          {news.category.name}
        </span>
      )}
      {news.status === 'archived' && (
        <span className="content-detail-badge" style={{ backgroundColor: '#999', color: 'white' }}>
          アーカイブ
        </span>
      )}
    </>
  );

  // 日付のフォーマット
  const formattedDate = news.createdAt
    ? format(new Date(news.createdAt), 'yyyy年MM月dd日', { locale: ja })
    : '';

  // 本文の改行を反映
  const formattedBody = news.body.split('\n\n').map((paragraph, index) => (
    <p key={index} style={{ marginBottom: '16px' }}>{paragraph}</p>
  ));

  // メインセクションの作成
  const mainSections = [
    {
      title: '記事内容',
      content: <div>{formattedBody}</div>
    }
  ];

  // サイドバー項目の作成
  const sidebarItems = [];

  // 公開日
  sidebarItems.push({
    label: '公開日',
    content: <p>{formattedDate}</p>
  });

  // 著者情報
  if (news.author) {
    sidebarItems.push({
      label: '投稿者',
      content: (
        <div className="content-detail-author">
          {news.author.profileImageUrl && (
            <Image
              src={news.author.profileImageUrl}
              alt={news.author.username}
              className="content-detail-author-image"
              width={40}
              height={40}
            />
          )}
          <span>{news.author.username}</span>
        </div>
      )
    });
  }

  // カテゴリ
  if (news.category) {
    sidebarItems.push({
      label: 'カテゴリ',
      content: <p>{news.category.name}</p>
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
      title={news.title}
      imageUrl={news.imageUrl}
      badges={badges}
      mainSections={mainSections}
      sidebarItems={sidebarItems}
      backLink="/news"
      backLinkText="ニュース一覧に戻る"
      actions={actions}
    />
  );
}
