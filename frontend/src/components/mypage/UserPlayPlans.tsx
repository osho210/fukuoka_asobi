'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_PLAY_PLANS } from '@/graphql/mypage';
import '@/styles/UserComponents.css';
import Link from 'next/link';
import Image from 'next/image';

/**
 * 型定義
 * --------------------------------------------------
 */
interface UserPlayPlansQuery {
  userPlayPlans: PlayPlan[];
}

interface PlayPlan {
  id: string;
  planName: string;
  description?: string;
  imageUrl?: string | null;
  status: string;
  createdAt: string;
  totalBudget?: number;
  recommendedFor?: string;
}

export const UserPlayPlans: React.FC = () => {
  // プラン一覧を取得
  const { data, loading, error } = useQuery<UserPlayPlansQuery>(GET_USER_PLAY_PLANS, {
    variables: { limit: 20 },
    fetchPolicy: 'network-only', // キャッシュを使わず常に最新データを取得
  });

  // ローディング中の表示
  if (loading) {
    return (
      <div className="user-components-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">読み込み中...</p>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="user-components-error">
        <p>エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  // プランがない場合の表示
  if (!data?.userPlayPlans || data.userPlayPlans.length === 0) {
    return (
      <div className="user-components-empty">
        <p>作成したプランはありません。</p>
        <Link href="/search" className="user-components-create-button">
          新しいプランを作成する
        </Link>
      </div>
    );
  }

  // プラン一覧の表示
  return (
    <div className="user-components-container">
      <div className="user-components-header">
        <h2 className="user-components-title">作成したプラン一覧</h2>
        <Link href="/search" className="user-components-create-button">
          プランを作成
        </Link>
      </div>

      <div className="user-components-grid">
        {data.userPlayPlans.map((plan: PlayPlan) => (
          <div key={plan.id} className="user-components-card">
            <Link href={`/plans/${plan.id}`}>
              <div className="user-components-card-image">
                {plan.imageUrl ? (
                  <Image src={plan.imageUrl} alt={plan.planName} width={300} height={300} />
                ) : (
                  <div className="user-components-card-no-image">No Image</div>
                )}
                <div className="user-components-card-status">
                  {plan.status === 'PUBLISHED' ? '公開中' : '下書き'}
                </div>
              </div>
              <div className="user-components-card-content">
                <h3 className="user-components-card-title">{plan.planName}</h3>
                <p className="user-components-card-description">
                  {plan.description && plan.description.length > 50
                    ? `${plan.description.substring(0, 50)}...`
                    : plan.description}
                </p>
                <div className="user-components-card-meta">
                  <p className="user-components-card-budget">
                    予算: {plan.totalBudget ? `¥${plan.totalBudget.toLocaleString()}` : '未設定'}
                  </p>
                  <p className="user-components-card-date">
                    作成日: {new Date(plan.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                {plan.recommendedFor && (
                  <div className="user-components-card-tags">
                    {plan.recommendedFor}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
