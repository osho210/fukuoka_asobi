'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import { fetchModelList } from '@/lib/modelGraphQL';

// 各モデルの列定義
interface ColumnDefinition {
  header: string;
  accessorKey: string;
  sortable: boolean;
}

const columnConfigs: Record<string, ColumnDefinition[]> = {
  areas: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'areaName', sortable: true },
    { header: '地区', accessorKey: 'district.districtName', sortable: false },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  categories: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'name', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  districts: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'districtName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  hashtags: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'hashtagName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  menus: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'menuName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  purposes: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'purposeName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  recommended_fors: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'name', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  spot_ambiances: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'ambianceName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  spots: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'spotName', sortable: true },
    { header: '住所', accessorKey: 'address', sortable: false },
    { header: '地区', accessorKey: 'district.districtName', sortable: false },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  play_plans: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'planName', sortable: true },
    { header: 'ステータス', accessorKey: 'status', sortable: true },
    { header: '作成者', accessorKey: 'user.username', sortable: false },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  events: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'タイトル', accessorKey: 'title', sortable: true },
    { header: '場所', accessorKey: 'location', sortable: false },
    { header: '開始日時', accessorKey: 'startDatetime', sortable: true },
    { header: '終了日時', accessorKey: 'endDatetime', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  news: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'タイトル', accessorKey: 'title', sortable: true },
    { header: '公開日', accessorKey: 'publishedAt', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
};

// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null;
}

// モデル名の日本語表示
const modelDisplayNames: Record<string, string> = {
  areas: 'エリア',
  categories: 'カテゴリー',
  districts: '地区',
  hashtags: 'ハッシュタグ',
  menus: 'メニュー',
  purposes: '目的',
  recommended_fors: 'おすすめ対象',
  spot_ambiances: '雰囲気',
  spots: 'スポット',
  play_plans: '遊びプラン',
  events: 'イベント',
  news: 'ニュース',
};

export default function ModelListPage() {
  const params = useParams();
  const router = useRouter();
  const modelRoute = params.model as string;

  const [data, setData] = useState<ModelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const pageSize = 10;
  const columns = columnConfigs[modelRoute] || [];
  const displayName = modelDisplayNames[modelRoute] || modelRoute;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      console.log('モデルルート:', modelRoute);

      try {
        // バックエンドAPIが利用可能な場合はGraphQLクエリを使用
        const variables = {
          limit: pageSize,
          sortField: sortField || undefined,
          sortDirection: sortDirection || undefined,
        };

        const result = await fetchModelList(modelRoute, variables);
        setData(result);
        console.log('取得したデータ:', result);
        setTotalCount(result.length); // 実際のAPIではtotalCountも返すべき
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データの取得に失敗しました。  xcxcx');

      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [modelRoute, sortField, sortDirection, pageSize]);

  const handleRowClick = (item: ModelData) => {
    router.push(`/${modelRoute}/${item.id}`);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!modelRoute || !columns.length) {
    return <div className="p-4">モデルが見つかりません</div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-page-title">{displayName}一覧</h1>
        <Button onClick={() => router.push(`/${modelRoute}/new`)}>
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
