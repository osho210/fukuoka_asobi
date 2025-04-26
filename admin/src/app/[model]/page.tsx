'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';

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
    { header: '名前', accessorKey: 'categoryName', sortable: true },
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
    { header: '名前', accessorKey: 'recommendedForName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  spot_ambiances: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'ambianceName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  spots: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'storeName', sortable: true },
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

// ダミーデータ（GraphQLが未実装の場合に使用）
const dummyData: Record<string, ModelData[]> = {
  areas: [
    { id: '1', areaName: '天神', district: { districtName: '福岡市中央区' }, updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', areaName: '博多', district: { districtName: '福岡市博多区' }, updatedAt: '2025-04-02T10:00:00Z' },
  ],
  categories: [
    { id: '1', categoryName: 'カフェ', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', categoryName: 'レストラン', updatedAt: '2025-04-02T10:00:00Z' },
  ],
  districts: [
    { id: '1', districtName: '福岡市中央区', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', districtName: '福岡市博多区', updatedAt: '2025-04-02T10:00:00Z' },
  ],
  hashtags: [
    { id: '1', hashtagName: 'おしゃれ', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', hashtagName: '穴場', updatedAt: '2025-04-02T10:00:00Z' },
  ],
  menus: [
    { id: '1', menuName: 'モーニング', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', menuName: 'ランチ', updatedAt: '2025-04-02T10:00:00Z' },
  ],
  purposes: [
    { id: '1', purposeName: 'デート', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', purposeName: '女子会', updatedAt: '2025-04-02T10:00:00Z' },
  ],
  recommended_fors: [
    { id: '1', recommendedForName: 'カップル', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', recommendedForName: '友達同士', updatedAt: '2025-04-02T10:00:00Z' },
  ],
  spot_ambiances: [
    { id: '1', ambianceName: '落ち着いた', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', ambianceName: '賑やか', updatedAt: '2025-04-02T10:00:00Z' },
  ],
  spots: [
    { id: '1', storeName: 'カフェA', address: '福岡市中央区天神1-1-1', district: { districtName: '福岡市中央区' }, updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', storeName: 'レストランB', address: '福岡市博多区博多駅前2-2-2', district: { districtName: '福岡市博多区' }, updatedAt: '2025-04-02T10:00:00Z' },
  ],
  play_plans: [
    { id: '1', planName: '天神デートプラン', status: '公開', user: { username: '山田太郎' }, updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', planName: '博多グルメツアー', status: '下書き', user: { username: '佐藤花子' }, updatedAt: '2025-04-02T10:00:00Z' },
  ],
  events: [
    { id: '1', title: '天神祭り', location: '福岡市中央区天神', startDatetime: '2025-05-01T10:00:00Z', endDatetime: '2025-05-01T18:00:00Z', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', title: '博多どんたく', location: '福岡市博多区', startDatetime: '2025-05-03T09:00:00Z', endDatetime: '2025-05-04T21:00:00Z', updatedAt: '2025-04-02T10:00:00Z' },
  ],
  news: [
    { id: '1', title: '新しいカフェがオープン', publishedAt: '2025-04-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z' },
    { id: '2', title: '博多駅周辺の新スポット特集', publishedAt: '2025-04-02T10:00:00Z', updatedAt: '2025-04-02T10:00:00Z' },
  ],
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const pageSize = 10;
  const columns = columnConfigs[modelRoute] || [];
  const displayName = modelDisplayNames[modelRoute] || modelRoute;

  useEffect(() => {
    // GraphQLクエリの代わりにダミーデータを使用
    const fetchData = () => {
      // ダミーデータを取得
      const modelData = dummyData[modelRoute] || [];

      // ソート処理
      const sortedData = [...modelData];
      if (sortField && sortDirection) {
        sortedData.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];

          if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      setData(sortedData);
      setTotalCount(sortedData.length);
    };

    fetchData();
  }, [modelRoute, sortField, sortDirection]);

  const handleRowClick = (item: ModelData) => {
    router.push(`/admin/${modelRoute}/${item.id}`);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{displayName}一覧</h1>
        <Button onClick={() => router.push(`/admin/${modelRoute}/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

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
    </div>
  );
}
