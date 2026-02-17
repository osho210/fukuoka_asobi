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
  // is_indexable=true かつ status=published の場合のみ検索エンジンにインデックスされる
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

  // フィルタをリセット
  const handleResetFilters = () => {
    setTypeFilter(null);
    setIsIndexableFilter(null);
    setStatusFilter(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ページヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">SEO インデックス管理</h1>
              <p className="mt-2 text-base text-gray-600 max-w-2xl">
                コンテンツのインデックス状態を管理し、検索エンジンへの公開設定を制御します。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-6">
          {/* フィルタセクション */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-gray-900">フィルタ条件</h2>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 sm:mt-0 admin-btn admin-btn-outline admin-btn-sm"
                >
                  フィルタをリセット
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* コンテンツ種別 */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    コンテンツ種別
                  </label>
                  <select
                    value={typeFilter ?? ''}
                    onChange={(e) => setTypeFilter(e.target.value as RecordType | null)}
                    className="admin-input"
                  >
                    <option value="">すべて</option>
                    <option value="spot">スポット</option>
                    <option value="plan">プラン</option>
                    <option value="event">イベント</option>
                    <option value="news">ニュース</option>
                  </select>
                </div>

                {/* 検索エンジン登録 */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    検索エンジン登録
                  </label>
                  <select
                    value={isIndexableFilter ?? ''}
                    onChange={(e) => setIsIndexableFilter(e.target.value as IndexableFilter | null)}
                    className="admin-input"
                  >
                    <option value="">すべて</option>
                    <option value="true">許可</option>
                    <option value="false">禁止</option>
                  </select>
                </div>

                {/* 公開ステータス */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    公開ステータス
                  </label>
                  <select
                    value={statusFilter ?? ''}
                    onChange={(e) => setStatusFilter(e.target.value as StatusEnum | null)}
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
          </div>

          {/* データテーブルセクション */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* テーブルヘッダー */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {loading && (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin"></div>
                      <span className="text-sm text-blue-700 font-medium">データを読み込み中...</span>
                    </div>
                  )}
                  {!loading && !error && indexList.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{indexList.length}</span>
                      <span> 件のコンテンツ</span>
                    </div>
                  )}
                  {!loading && !error && indexList.length === 0 && (
                    <div className="text-sm text-gray-600">検索結果: 0 件</div>
                  )}
                </div>
                {error && (
                  <div className="text-sm text-red-700 font-medium">
                    ⚠️ エラーが発生しました
                  </div>
                )}
              </div>
            </div>

            {/* ローディング状態 */}
            {loading && (
              <div className="px-6 py-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-8 w-8 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin"></div>
                </div>
                <p className="text-gray-600">データを読み込み中...</p>
              </div>
            )}

            {/* エラー状態 */}
            {error && (
              <div className="px-6 py-8">
                <div className="rounded-lg bg-red-50 border border-red-200 p-6">
                  <div className="flex gap-3">
                    <div className="text-red-600 font-semibold">⚠️</div>
                    <div>
                      <h3 className="text-red-900 font-semibold mb-1">エラーが発生しました</h3>
                      <p className="text-red-700 text-sm">{error.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* テーブル */}
            {!loading && !error && (
              <>
                {indexList.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-2 text-2xl">📋</div>
                    <p className="text-gray-600 font-medium">データがありません</p>
                    <p className="text-gray-500 text-sm mt-1">フィルタ条件を変更してお試しください</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="admin-table admin-table-striped">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>種別</th>
                          <th>タイトル</th>
                          <th>公開ステータス</th>
                          <th>検索エンジン登録</th>
                          <th>インデックス状態</th>
                          <th>最終更新日時</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {indexList.map((row, index) => (
                          <tr key={`${row.type}-${row.id}-${row.updatedAt}-${index}`}>
                            <td className="text-gray-900 font-medium text-sm">{row.id}</td>
                            <td>
                              <span className={`badge ${getTypeBadgeClass(row.type)}`}>
                                {getTypeLabel(row.type)}
                              </span>
                            </td>
                            <td className="text-gray-900 max-w-xs truncate">{row.title}</td>
                            <td>{getStatusBadge(row.status)}</td>
                            <td>
                              <span className={`badge ${row.isIndexable ? 'badge-success' : 'badge-secondary'}`}>
                                {row.isIndexable ? '許可' : '禁止'}
                              </span>
                            </td>
                            <td>{getIndexBadge(row.isIndexable, row.status)}</td>
                            <td className="text-gray-600 text-sm whitespace-nowrap">{formatDate(row.updatedAt)}</td>
                            <td>
                              <Link
                                href={row.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                              >
                                表示
                                <span>↗</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* フッター情報 */}
                {indexList.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                      <div className="text-gray-600">
                        表示中: <span className="font-semibold text-gray-900">{indexList.length}</span> 件
                      </div>
                      <div className="text-gray-500 text-xs">
                        最後に更新: {indexList.length > 0 ? formatDate(indexList[0].updatedAt) : '—'}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
