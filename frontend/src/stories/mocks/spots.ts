/**
 * スポット一覧ページ用モックデータ
 */
import { GET_SPOTS } from '@/graphql/queries/getSpots';

// カテゴリーのモックデータ
export const mockCategories = [
  { id: '1', name: 'カフェ', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: '2', name: 'レストラン', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: '3', name: '観光スポット', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: '4', name: '公園', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: '5', name: 'ショッピング', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
];

// スポットのモックデータ
export const mockSpots = [
  {
    id: '1',
    spotName: '博多屋台街',
    description: '博多名物の屋台が並ぶエリア。ラーメンや焼き鳥などの博多グルメを楽しめます。',
    address: '福岡市博多区中洲',
    catchphrase: '博多の味を堪能する',
    parkingAvailable: false,
    reviewRating: 4.5,
    reviewCount: 350,
    budgetRange: '1000-3000',
    theme: 'グルメ',
    imageUrl: { id: '1', url: '/itoshima.png' },
    district: { id: '1', districtName: '博多区' },
    areas: [{ id: '1', areaName: '中洲' }],
    categories: [{ id: '2', name: 'レストラン' }],
    hashtags: [{ id: '1', hashtagName: '屋台' }, { id: '2', hashtagName: '博多グルメ' }],
  },
  {
    id: '2',
    spotName: '大濠公園',
    description: '福岡市の中心部にある美しい公園。ジョギングやピクニックに最適です。',
    address: '福岡市中央区大濠公園',
    catchphrase: '都会のオアシス',
    parkingAvailable: true,
    reviewRating: 4.7,
    reviewCount: 520,
    budgetRange: '0-500',
    theme: '自然',
    imageUrl: { id: '2', url: '/itoshima.png' },
    district: { id: '2', districtName: '中央区' },
    areas: [{ id: '2', areaName: '大濠' }],
    categories: [{ id: '4', name: '公園' }],
    hashtags: [{ id: '3', hashtagName: 'ピクニック' }, { id: '4', hashtagName: 'ジョギング' }],
  },
  {
    id: '3',
    spotName: 'キャナルシティ博多',
    description: 'ショッピング、映画、グルメが楽しめる大型複合施設。',
    address: '福岡市博多区住吉',
    catchphrase: '一日中楽しめる',
    parkingAvailable: true,
    reviewRating: 4.3,
    reviewCount: 890,
    budgetRange: '3000-10000',
    theme: 'ショッピング',
    imageUrl: { id: '3', url: '/itoshima.png' },
    district: { id: '1', districtName: '博多区' },
    areas: [{ id: '3', areaName: '住吉' }],
    categories: [{ id: '5', name: 'ショッピング' }],
    hashtags: [{ id: '5', hashtagName: 'ショッピング' }, { id: '6', hashtagName: '映画' }],
  },
  {
    id: '4',
    spotName: 'おしゃれカフェ 天神店',
    description: '天神エリアにある人気カフェ。自家焙煎コーヒーとスイーツが自慢。',
    address: '福岡市中央区天神',
    catchphrase: '至福のひととき',
    parkingAvailable: false,
    reviewRating: 4.6,
    reviewCount: 280,
    budgetRange: '500-1500',
    theme: 'カフェ',
    imageUrl: { id: '4', url: '/itoshima.png' },
    district: { id: '2', districtName: '中央区' },
    areas: [{ id: '4', areaName: '天神' }],
    categories: [{ id: '1', name: 'カフェ' }],
    hashtags: [{ id: '7', hashtagName: 'コーヒー' }, { id: '8', hashtagName: 'スイーツ' }],
  },
];

// Apollo Clientモック配列
export const spotsPageMocks = [
  {
    request: {
      query: GET_SPOTS,
    },
    result: {
      data: {
        spots: mockSpots,
        categories: mockCategories,
      },
    },
  },
];
