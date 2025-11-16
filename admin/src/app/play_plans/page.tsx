'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import '@/styles/play-plans.css';
import { GET_PLAY_PLANS } from '@/graphql/queries/getPlayPlans';
import { PlayPlan } from '@/__generated__/graphql';

export default function PlayPlansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error } = useQuery(GET_PLAY_PLANS);

  const handleDelete = async (id: string, planName: string) => {
    if (!confirm(`「${planName}」を削除してもよろしいですか？`)) {
      return;
    }

    try {
      // TODO: 削除機能は後で実装
      alert('削除機能は未実装です');
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  const filteredPlans = data?.playPlans?.filter((plan: PlayPlan) =>
    plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'play-plans__badge play-plans__badge--published';
      case 'DRAFT':
        return 'play-plans__badge play-plans__badge--draft';
      default:
        return 'play-plans__badge play-plans__badge--draft';
    }
  };

  const getTripTypeBadgeClass = (tripType: string) => {
    switch (tripType) {
      case 'DAY_TRIP':
        return 'play-plans__badge play-plans__badge--day-trip';
      case 'OVERNIGHT':
        return 'play-plans__badge play-plans__badge--overnight';
      default:
        return 'play-plans__badge play-plans__badge--day-trip';
    }
  };

  if (loading) return <div className="play-plans__loading">読み込み中...</div>;
  if (error) return <div className="play-plans__error">エラー: {error.message}</div>;

  return (
    <div className="play-plans">
      <div className="play-plans__header">
        <h1 className="play-plans__title">遊びプラン管理</h1>
        <Link href="/play_plans/new" className="play-plans__create-button">
          新規作成
        </Link>
      </div>

      {/* 検索フィルター */}
      <div className="play-plans__search">
        <input
          type="text"
          placeholder="プラン名、説明、場所で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="play-plans__search-input"
        />
      </div>

      {/* プラン一覧テーブル */}
      <div className="play-plans__table-container">
        <table className="play-plans__table">
          <thead className="play-plans__table-header">
            <tr>
              <th className="play-plans__table-header-cell">プラン名</th>
              <th className="play-plans__table-header-cell">状態</th>
              <th className="play-plans__table-header-cell">区分</th>
              <th className="play-plans__table-header-cell">スポット</th>
              <th className="play-plans__table-header-cell">予算</th>
              <th className="play-plans__table-header-cell">作成者</th>
              <th className="play-plans__table-header-cell">更新日</th>
              <th className="play-plans__table-header-cell">操作</th>
            </tr>
          </thead>
          <tbody className="play-plans__table-body">
            {filteredPlans.map((plan: PlayPlan) => (
              <tr key={plan.id} className="play-plans__table-row">
                <td className="play-plans__table-cell">
                  <div className="play-plans__plan-info">
                    <div className="play-plans__plan-name">{plan.planName}</div>
                    {plan.description && (
                      <div className="play-plans__plan-description">
                        {plan.description}
                      </div>
                    )}
                    {plan.location && (
                      <div className="play-plans__plan-location">
                        📍 {plan.location}
                      </div>
                    )}
                  </div>
                </td>
                <td className="play-plans__table-cell">
                  <span className={getStatusBadgeClass(plan.status)}>
                    {plan.status === 'PUBLISHED' ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="play-plans__table-cell">
                  <span className={getTripTypeBadgeClass(plan.tripType)}>
                    {plan.tripType === 'DAY_TRIP' ? '日帰り' : '泊まり'}
                  </span>
                </td>
                <td className="play-plans__table-cell">
                  {plan.planDetails.length}スポット
                </td>
                <td className="play-plans__table-cell">
                  {plan.totalBudget ? `¥${plan.totalBudget.toLocaleString()}` : '-'}
                </td>
                <td className="play-plans__table-cell">
                  {plan.user?.username || '-'}
                </td>
                <td className="play-plans__table-cell">
                  {new Date(plan.updatedAt).toLocaleDateString('ja-JP')}
                </td>
                <td className="play-plans__table-cell">
                  <div className="play-plans__actions">
                    <Link
                      href={`/play_plans/${plan.id}/edit`}
                      className="play-plans__action-link"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(plan.id, plan.planName)}
                      className="play-plans__action-button"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPlans.length === 0 && (
          <div className="play-plans__empty">
            <div className="play-plans__empty-text">
              {searchTerm ? '検索条件に一致するプランが見つかりません' : 'プランがありません'}
            </div>
          </div>
        )}
      </div>

      {/* 統計情報 */}
      <div className="play-plans__stats">
        <div className="play-plans__stat-card">
          <div className="play-plans__stat-label">総プラン数</div>
          <div className="play-plans__stat-value">{data?.playPlans?.length || 0}</div>
        </div>
        <div className="play-plans__stat-card">
          <div className="play-plans__stat-label">公開中</div>
          <div className="play-plans__stat-value play-plans__stat-value--published">
            {data?.playPlans?.filter((p: PlayPlan) => p.status === 'PUBLISHED').length || 0}
          </div>
        </div>
        <div className="play-plans__stat-card">
          <div className="play-plans__stat-label">下書き</div>
          <div className="play-plans__stat-value play-plans__stat-value--draft">
            {data?.playPlans?.filter((p: PlayPlan) => p.status === 'DRAFT').length || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
