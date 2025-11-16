'use client';

import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_FAVORITES, REMOVE_FAVORITE } from '@/graphql/favorites';
import '@/styles/UserComponents.css';
import Link from 'next/link';
import Image from 'next/image';
import { Favorite } from '@/__generated__/graphql';

/**
 * 型定義
 * --------------------------------------------------
 */
interface UserFavoritesQuery {
  userFavorites: Favorite[];
}

/**
 * コンポーネント
 * --------------------------------------------------
 */
export const UserBookmarks: React.FC = () => {
  /**
   * GraphQL — お気に入り一覧取得
   */
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<UserFavoritesQuery>(GET_USER_FAVORITES, {
    fetchPolicy: 'network-only', // 常に最新データを取得
  });

  /**
   * GraphQL — お気に入り解除
   */
  const [removeFavorite, { loading: removing }] = useMutation(REMOVE_FAVORITE, {
    onCompleted: () => refetch(),
  });

  /**
   * お気に入り解除ハンドラ
   */
  const handleRemove = (playPlanId: string) => {
    if (removing) return;
    if (!confirm('お気に入りを解除しますか？')) return;

    removeFavorite({ variables: { playPlanId } });
  };

  /**
   * ローディング・エラー処理
   */
  if (loading) {
    return (
      <div className="user-components-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-2">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-components-error">エラーが発生しました: {error.message}</div>
    );
  }

  if (!data || data.userFavorites.length === 0) {
    return (
      <div className="user-components-empty">
        <p>お気に入りはありません。</p>
        <p className="user-components-description">
          プランページの「お気に入り」ボタンをクリックすると、ここに表示されます。
        </p>
      </div>
    );
  }

  /**
   * 本体描画
   */
  return (
    <div className="user-components-container">
      <h2 className="user-components-title">お気に入りプラン</h2>

      <div className="user-components-grid">
        {data.userFavorites.map(({ id, playPlan, createdAt }) => (
          <div key={id} className="user-components-card">
            <Link href={`/plans/${id}`}>
              <div className="user-components-card-image">
                {playPlan.imageUrl ? (
                  <Image
                    src={playPlan.imageUrl}
                    alt={playPlan.planName}
                    width={300}
                    height={200}
                    className="user-components-card-image"
                  />
                ) : (
                  <div className="user-components-card-no-image">No Image</div>
                )}
                <div className="user-components-card-status">
                  {playPlan.status === 'PUBLISHED' ? '公開中' : '下書き'}
                </div>
              </div>
              <div className="user-components-card-content">
                <h3 className="user-components-card-title">{playPlan.planName}</h3>
                <p className="user-components-card-description">
                  {playPlan.description && playPlan.description.length > 50
                    ? `${playPlan.description.substring(0, 50)}...`
                    : playPlan.description}
                </p>
                <div className="user-components-card-meta">
                  <p className="user-components-card-budget">
                    予算: {playPlan.totalBudget ? `¥${playPlan.totalBudget.toLocaleString()}` : '未設定'}
                  </p>
                  <p className="user-components-card-date">
                    作成日: {new Date(createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                {playPlan.recommendedFor && (
                  <div className="user-components-card-tags">
                    {playPlan.recommendedFor}
                  </div>
                )}
              </div>
            </Link>
            <button
              className="user-components-remove-btn"
              onClick={() => handleRemove(playPlan.id)}
              disabled={removing}
              aria-label="お気に入り解除"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
