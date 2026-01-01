'use client';

export const runtime = 'edge';

import { useEffect, useState, useMemo } from 'react';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import { fetchModelList } from '@/lib/modelGraphQL';
import { eventsConfig } from '@/lib/models/events';
import { getModelDisplayName } from '@/lib/modelConfig';

// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null;
}

/**
 * MODEL_DISPLAY一覧ページ
 */
export default function EventsPage() {
  const modelRoute = 'events';
  const pageSize = 10;

  const [data, setData] = useState<ModelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);


  const columns = useMemo(() => eventsConfig.columns, []);
  const displayName = useMemo(() => getModelDisplayName(modelRoute), []);

  // データ取得
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const variables = {
        limit: pageSize,
        sortField: sortField || undefined,
        sortDirection: sortDirection || undefined,
      };

      const result = await fetchModelList(modelRoute, variables);
      setData(result);
      setTotalCount(result.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(`データの取得に失敗しました: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }

  useEffect(() => {
    fetchData();
  }, [sortField, sortDirection]);

  // ソート変更ハンドラ
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);

  // ページ変更ハンドラ
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

  // 行クリック時に詳細ページへ遷移
  const handleRowClick = (item: ModelData) => {
    window.location.href = `/${modelRoute}/${item.id}`;

  // 新規作成ボタンクリック時
  const handleCreateClick = () => {
    window.location.href = `/${modelRoute}/new`;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-page-title">{displayName}一覧</h1>
        <Button onClick={handleCreateClick}>
          <PlusIcon className="admin-mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      {error && (
        <div className="admin-alert admin-alert-danger admin-mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="admin-loading">
          <div className="admin-spinner"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
          keyField="id"
          pagination={{
            pageSize,
            totalCount,
            currentPage,
            onPageChange: handlePageChange,
          }}
          sorting={{
            field: sortField,
            direction: sortDirection,
            onSortChange: handleSortChange,
          }}
        />
      )}

    </div>
  );
}
