'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import '@/styles/admin.css';
import { GET_SEO_INDEX_LIST } from '@/graphql/queries/getSeoIndexList';
import { GetSeoIndexListQuery, StatusEnum } from '@/__generated__/graphql';

// レコード種別の型定義
type RecordType = 'spot' | 'plan' | 'event' | 'news';

// フィルタ状態の型定義
type IndexableFilter = 'true' | 'false';

// SeoIndexRow型を生成された型から取得
type SeoIndexRow = GetSeoIndexListQuery['seoIndexList'][number];

export default function SeoIndexPage() {
  const [typeFilter, setTypeFilter] = useState<RecordType | null>(null);
  const [isIndexableFilter, setIsIndexableFilter] = useState<IndexableFilter | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusEnum | null>(null);

  const { data, loading, error } = useQuery<GetSeoIndexListQuery>(GET_SEO_INDEX_LIST, {
    variables: {
      type: typeFilter,
      isIndexable: isIndexableFilter ? isIndexableFilter === 'true' : null,
      status: statusFilter,
    },
  });

  const indexList: SeoIndexRow[] = data?.seoIndexList || [];

  // ステータスラベルを返却する関数
  // 2024/02/14: 公開状態をユーザーにわかりやすく表示するため
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      published: '公開',
      draft: '下書き',
      archived: 'アーカイブ',
      deleted: '削除済み',
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // ステータスバッジのCSSクラスを返却する関数
  const getStatusBadgeClass = (status: string): string => {
    const classMap: Record<string, string> = {
      published: 'badge-success',
      draft: 'badge-warning',
      archived: 'badge-secondary',
      deleted: 'badge-danger',
    };
    return classMap[status.toLowerCase()] || '';
  };

  // ステータスバッジを返却する関数
  const getStatusBadge = (status: string): React.ReactNode => {
    return (
      <span className={`badge ${getStatusBadgeClass(status)}`}>
        {getStatusLabel(status)}
      </span>
    );
  };

  // インデックス想定バッジを返却する関数
  // 2024/02/14: is_indexable=true かつ status=published の場合のみ検索エンジンにインデックスされる
  const getIndexBadge = (isIndexable: boolean, status: string): React.ReactNode => {
    const shouldIndex = isIndexable && status.toLowerCase() === 'published';
    return (
      <span className={`badge ${shouldIndex ? 'badge-success' : 'badge-secondary'}`}>
        {shouldIndex ? 'index' : 'noindex'}
      </span>
    );
  };

  // レコード種別のラベルを返却する関数
  const getTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      spot: 'スポット',
      plan: 'プラン',
      event: 'イベント',
      news: 'ニュース',
    };
    return typeMap[type] || type;
  };

  // レコード種別のバッジCSSクラスを返却する関数
  const getTypeBadgeClass = (type: string): string => {
    const classMap: Record<string, string> = {
      spot: 'badge-primary',
      plan: 'badge-info',
      event: 'badge-warning',
      news: 'badge-success',
    };
    return classMap[type] || 'badge-secondary';
  };

  // 日時を日本のロケールで「年/月/日 時:分」形式に変換
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">SEO インデックス管理</h1>
        <p className="text-gray-600">コンテンツのインデックス状態を管理します</p>
      </div>

      {/* フィルタ */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              コンテンツ種別
            </label>
            <select
              value={typeFilter ?? ''}
              onChange={(e) => setTypeFilter(e.target.value || null as RecordType | null)}
              className="admin-input"
            >
              <option value="">すべて</option>
              <option value="spot">スポット</option>
              <option value="plan">プラン</option>
              <option value="event">イベント</option>
              <option value="news">ニュース</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              検索エンジン登録
            </label>
            <select
              value={isIndexableFilter ?? ''}
              onChange={(e) => setIsIndexableFilter(e.target.value || null as IndexableFilter | null)}
              className="admin-input"
            >
              <option value="">すべて</option>
              <option value="true">許可</option>
              <option value="false">禁止</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              公開ステータス
            </label>
            <select
              value={statusFilter ?? ''}
              onChange={(e) => setStatusFilter(e.target.value || null as StatusEnum | null)}
              className="admin-input"
            >
              <option value="">すべて</option>
              <option value={StatusEnum.Published}>公開</option>
              <option value={StatusEnum.Draft}>下書き</option>
              <option value={StatusEnum.Archived}>アーカイブ</option>
            </select>
          </div>
        </div>
      </div>

      {/* データテーブル */}
      <div className="admin-card">
        {loading && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-blue-700">データを読み込み中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-red-700">エラーが発生しました: {error.message}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>コンテンツ種別</th>
                  <th>タイトル</th>
                  <th>公開ステータス</th>
                  <th>検索エンジン登録</th>
                  <th>インデックス状態</th>
                  <th>最終更新日時</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {indexList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      データがありません
                    </td>
                  </tr>
                ) : (
                  indexList.map((row) => (
                    <tr key={`${row.type}-${row.id}`}>
                      <td>{row.id}</td>
                      <td>
                        <span className={`badge ${getTypeBadgeClass(row.type)}`}>
                          {getTypeLabel(row.type)}
                        </span>
                      </td>
                      <td>{row.title}</td>
                      <td>{getStatusBadge(row.status)}</td>
                      <td>
                        <span className={`badge ${row.isIndexable ? 'badge-success' : 'badge-secondary'}`}>
                          {row.isIndexable ? '許可' : '禁止'}
                        </span>
                      </td>
                      <td>{getIndexBadge(row.isIndexable, row.status)}</td>
                      <td>{formatDate(row.updatedAt)}</td>
                      <td>
                        <Link
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          表示
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && indexList.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            合計: {indexList.length} 件
          </div>
        )}
      </div>
    </div>
  );
}
