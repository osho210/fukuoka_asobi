'use client';

export const runtime = 'edge';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import { fetchModelList, fetchRelationOptions } from '@/lib/modelGraphQL';
import { ModelDetailModal } from '@/components/ModelDetailModal';
import { modelConfigs, modelDisplayNames } from '@/lib/modelConstants';
import { Select } from '@/components/forms/Select';
import { useRouter } from 'next/navigation';


// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null;
}

/**
 * モデルデータを取得・管理するカスタムフック
 */
function useModelData(modelRoute: string, pageSize: number) {
  const [data, setData] = useState<ModelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // データ取得関数
  const fetchData = async () => {
    if (!modelRoute) return;

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
      setTotalCount(result.length); // 実際のAPIではtotalCountも返すべき
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(`データの取得に失敗しました: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // モデルルートが変更されたときにデータを再取得
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!modelRoute) return;

      setIsLoading(true);
      setError(null);

      try {
        const variables = {
          limit: pageSize,
          sortField: sortField || undefined,
          sortDirection: sortDirection || undefined,
        };

        const result = await fetchModelList(modelRoute, variables);

        // コンポーネントがアンマウントされていない場合のみ状態を更新
        if (isMounted) {
          setData(result);
          setTotalCount(result.length);
          setIsLoading(false);
        }
      } catch (err) {
        // コンポーネントがアンマウントされていない場合のみ状態を更新
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
          setError(`データの取得に失敗しました: ${errorMessage}`);
          setIsLoading(false);
        }
      }
    };

    loadData();

    // クリーンアップ関数
    return () => {
      isMounted = false;
    };
  }, [modelRoute, sortField, sortDirection, pageSize]);

  // ソート変更ハンドラ
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  // ページ変更ハンドラ
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    data,
    isLoading,
    error,
    currentPage,
    totalCount,
    sortField,
    sortDirection,
    fetchData,
    handleSortChange,
    handlePageChange,
    filters,
    setFilters,
  };
}

/**
 * モデル一覧ページコンポーネント
 */
export default function ModelListPage() {
  const params = useParams();
  const modelRoute = params?.model as string;
  const pageSize = 10;

  // モーダル関連の状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ModelData | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  // カスタムフックを使用してデータ取得と状態管理
  const {
    data,
    isLoading,
    error,
    currentPage,
    totalCount,
    sortField,
    sortDirection,
    fetchData,
    handleSortChange,
    handlePageChange,
    filters,
    setFilters,
  } = useModelData(modelRoute, pageSize);

  const modelConfig = useMemo(() => modelConfigs[modelRoute], [modelRoute]);
  const columns = useMemo(() => modelConfig?.columns || [], [modelConfig]);
  const filterFields = useMemo(() => modelConfig?.filters || [], [modelConfig]);
  const displayName = useMemo(() => modelDisplayNames[modelRoute] || modelRoute, [modelRoute]);

  const [relationOptions, setRelationOptions] = useState<Record<string, { value: string; label: string }[]>>({});

  useEffect(() => {
    const fetchOptions = async () => {
      if (filterFields.length > 0) {
        const options = await fetchRelationOptions(filterFields);
        setRelationOptions(options);
      }
    };
    fetchOptions();
  }, [filterFields]);

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return data;
    }
    return data.filter(item => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;

        // ネストされたプロパティへのアクセスを安全に行う
        const getNestedValue = (obj: unknown, path: string): unknown => {
          return path.split('.').reduce((acc: unknown, part: string) => {
            if (typeof acc === 'object' && acc !== null && part in acc) {
              return (acc as Record<string, unknown>)[part];
            }
            return undefined;
          }, obj);
        };

        const nestedValue = getNestedValue(item, field);

        // `id` を持つオブジェクトの場合は `id` を比較
        if (nestedValue && typeof nestedValue === 'object' && 'id' in nestedValue) {
          return String((nestedValue as { id: unknown }).id) === value;
        }

        return String(nestedValue) === value;
      });
    });
  }, [data, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev: Record<string, string>) => ({ ...prev, [field]: value }));
  };

  // 行クリック時にモーダルを表示
  const handleRowClick = (item: ModelData) => {
    setSelectedItem(item);
    setIsNewItem(false);
    setIsModalOpen(true);
  };
  const router = useRouter();

  // 新規作成ボタンクリック時
  const handleCreateClick = () => {
    setSelectedItem(null);
    setIsNewItem(true);
    setIsModalOpen(true);
  };

  const handleSpotCreateClick = () => {
    router.push(`/${modelRoute}/new`);
  };
  // モーダルが閉じられたとき
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // データが保存されたとき
  const handleDataSaved = () => {
    // データを再取得
    fetchData();
  };

  // モデルが見つからない場合
  if (!modelRoute || !modelConfig) {
    console.log(`モデル "${modelRoute}" が見つかりません`);
    return <div className="p-4">モデルが見つかりません</div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-page-title">{displayName}一覧</h1>
        <Button
          // 項目数が多いspotモデルの場合は別ページで作成
          onClick={modelRoute === 'spots' || modelRoute === 'bucket_list_items' ? handleSpotCreateClick : handleCreateClick}
        >
          <PlusIcon className="admin-mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      {
        filterFields.length > 0 && (
          <div className="admin-filter-bar admin-mb-4 admin-p-4 admin-bg-gray-50 admin-rounded-lg">
            <div className="admin-grid admin-grid-cols-1 md:admin-grid-cols-3 lg:admin-grid-cols-4 admin-gap-4">
              {filterFields.map(field => (
                <Select
                  key={field.name}
                  id={`filter-${field.name}`}
                  label={field.label}
                  value={filters[field.name] || ''}
                  onChange={(value) => handleFilterChange(field.name, value)}
                  options={[
                    { value: '', label: `すべての${field.label}` },
                    ...(relationOptions[field.model] || [])
                  ]}
                  fullWidth
                />
              ))}
            </div>
          </div>
        )
      }

      {
        error && (
          <div className="admin-alert admin-alert-danger admin-mb-4">
            {error}
          </div>
        )
      }

      {
        isLoading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
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
        )
      }

      {/* モデル詳細モーダル */}
      <ModelDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        modelRoute={modelRoute}
        modelId={isNewItem ? 'new' : selectedItem?.id}
        onSaved={handleDataSaved}
        initialData={selectedItem}
      />
    </div >
  );
}
