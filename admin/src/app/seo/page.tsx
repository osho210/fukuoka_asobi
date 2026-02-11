'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import '@/styles/admin.css';
import { GET_SEO_INDEX_LIST } from '@/graphql/queries/getSeoIndexList';

type SeoIndexRow = {
  id: string;
  title: string;
  type: string;
  status: string;
  isIndexable: boolean;
  url: string;
  updatedAt: string;
};

export default function SeoIndexPage() {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [isIndexableFilter, setIsIndexableFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, loading, error } = useQuery(GET_SEO_INDEX_LIST, {
    variables: {
      type: typeFilter || null,
      isIndexable: isIndexableFilter ? isIndexableFilter === 'true' : null,
      status: statusFilter || null,
    },
  });

  const indexList: SeoIndexRow[] = data?.seoIndexList || [];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      published: { label: '公開', className: 'badge-success' },
      draft: { label: '下書き', className: 'badge-warning' },
      archived: { label: 'アーカイブ', className: 'badge-secondary' },
    };
    const statusInfo = statusMap[status] || { label: status, className: '' };
    return (
      <span className={`badge ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getIndexBadge = (isIndexable: boolean, status: string) => {
    const shouldIndex = isIndexable && status === 'published';
    return (
      <span className={`badge ${shouldIndex ? 'badge-success' : 'badge-secondary'}`}>
        {shouldIndex ? 'index' : 'noindex'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
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
        <p className="text-gray-600">スポット・プランのインデックス状態を管理します</p>
      </div>

      {/* フィルタ */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              種別
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="admin-input"
            >
              <option value="">すべて</option>
              <option value="spot">スポット</option>
              <option value="plan">プラン</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              インデックス可否
            </label>
            <select
              value={isIndexableFilter}
              onChange={(e) => setIsIndexableFilter(e.target.value)}
              className="admin-input"
            >
              <option value="">すべて</option>
              <option value="true">インデックス可</option>
              <option value="false">インデックス不可</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-input"
            >
              <option value="">すべて</option>
              <option value="published">公開</option>
              <option value="draft">下書き</option>
              <option value="archived">アーカイブ</option>
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
                  <th>種別</th>
                  <th>タイトル</th>
                  <th>ステータス</th>
                  <th>is_indexable</th>
                  <th>インデックス想定</th>
                  <th>更新日時</th>
                  <th>アクション</th>
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
                        <span className={`badge ${row.type === 'spot' ? 'badge-primary' : 'badge-info'}`}>
                          {row.type === 'spot' ? 'スポット' : 'プラン'}
                        </span>
                      </td>
                      <td>{row.title}</td>
                      <td>{getStatusBadge(row.status)}</td>
                      <td>
                        <span className={`badge ${row.isIndexable ? 'badge-success' : 'badge-secondary'}`}>
                          {row.isIndexable ? 'true' : 'false'}
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
