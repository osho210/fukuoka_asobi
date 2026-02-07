'use client';

import { ReactNode } from 'react';
import { News } from '@/__generated__/graphql';
import ContentDetail from '../ContentDetail';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { shareToLine, copyUrlToClipboard } from '@/utils/shareUtils';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast/ToastContainer';
import '@/styles/ContentDetail.css';
import Image from "next/image";
import { StatusEnum } from '@/__generated__/types';

type NewsDetailAdapterProps = {
  news: News;
};

/**
 * ニュース詳細をContentDetailコンポーネントに適応させるアダプター
 */
export default function NewsDetailAdapter({ news }: NewsDetailAdapterProps) {
  const { toasts, showToast, removeToast } = useToast();

  // LINEシェアハンドラー
  const handleShareLine = () => {
    shareToLine(news.title);
  };

  // URLコピーハンドラー
  const handleShareCopy = async () => {
    const success = await copyUrlToClipboard();
    if (success) {
      showToast('ニュースのURLをコピーしました！', 'success');
    } else {
      showToast('コピーに失敗しました', 'error');
    }
  };

  // バッジ要素の作成
  const badges: ReactNode = (
    <>
      {news.category && (
        <span className="content-detail-badge">
          {news.category.name}
        </span>
      )}
      {news.status === StatusEnum.Archived && (
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
        title={news.title}
        imageUrls={[]}
        badges={badges}
        mainSections={mainSections}
        sidebarItems={sidebarItems}
        backLink="/news"
        backLinkText="ニュース一覧に戻る"
        actions={actions}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
