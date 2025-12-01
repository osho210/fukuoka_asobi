/**
 * Adminモデル一覧ページ用モックデータ
 */

// スポットモデルのサンプルデータ
export const mockSpotsList = [
  {
    id: '1',
    spotName: '博多屋台街',
    address: '福岡市博多区中洲',
    reviewRating: 4.5,
    reviewCount: 350,
    status: 'active',
  },
  {
    id: '2',
    spotName: '大濠公園',
    address: '福岡市中央区大濠公園',
    reviewRating: 4.7,
    reviewCount: 520,
    status: 'active',
  },
  {
    id: '3',
    spotName: 'キャナルシティ博多',
    address: '福岡市博多区住吉',
    reviewRating: 4.3,
    reviewCount: 890,
    status: 'active',
  },
];

// カテゴリーモデルのサンプルデータ
export const mockCategoriesList = [
  { id: '1', name: 'カフェ' },
  { id: '2', name: 'レストラン' },
  { id: '3', name: '観光スポット' },
  { id: '4', name: '公園' },
  { id: '5', name: 'ショッピング' },
];

// エリアモデルのサンプルデータ
export const mockAreasList = [
  { id: '1', areaName: '中洲', district: { districtName: '博多区' } },
  { id: '2', areaName: '天神', district: { districtName: '中央区' } },
  { id: '3', areaName: '大濠', district: { districtName: '中央区' } },
];
