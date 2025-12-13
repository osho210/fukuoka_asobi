/**
 * フロントエンドのホームページ用モックデータ
 */

import { GET_PLAY_PLANS } from '@/graphql/playPlans';
import { GET_RECOMMENDED_SPOTS } from '@/graphql/getRecommendedSpots';
import { GET_RECOMMENDED_EVENTS } from '@/graphql/getRecommendedEvents';

// PlayPlansのモックデータ
export const mockPlayPlans = {
  playPlans: [
    {
      id: 1,
      planName: '博多満喫日帰りプラン',
      description: '博多の観光スポットを効率よく回るプランです。屋台グルメと観光を楽しめます。',
      imageUrl: '/default-image.png',
      location: '博多区',
      tripType: 'DAY_TRIP',
      totalBudget: 5000,
      rating: 4.5,
      reviewCount: 120,
      favoriteCount: 45,
      isFavorite: false,
      isRecommended: true,
      status: 'PUBLISHED',
      imageUrls: [{ id: '1', url: '/default-image.png' }],
      user: {
        id: '1',
        username: '福岡太郎',
        profileImageUrl: '/default-image.png',
        role: 'editor',
      },
    },
    {
      id: 2,
      planName: '糸島ドライブプラン',
      description: '糸島の海沿いを楽しむドライブプラン。おしゃれなカフェ巡りも。',
      imageUrl: '/default-image.png',
      location: '糸島市',
      tripType: 'DAY_TRIP',
      totalBudget: 8000,
      rating: 4.8,
      reviewCount: 85,
      favoriteCount: 62,
      isFavorite: true,
      isRecommended: true,
      status: 'PUBLISHED',
      imageUrls: [{ id: '2', url: '/default-image.png' }],
      user: {
        id: '2',
        username: '糸島花子',
        profileImageUrl: '/default-image.png',
        role: 'admin',
      },
    },
    {
      id: 3,
      planName: '天神ショッピング&グルメ',
      description: '天神エリアでショッピングとグルメを堪能するプランです。',
      imageUrl: '/default-image.png',
      location: '中央区',
      tripType: 'DAY_TRIP',
      totalBudget: 10000,
      rating: 4.2,
      reviewCount: 200,
      favoriteCount: 88,
      isFavorite: false,
      isRecommended: true,
      status: 'PUBLISHED',
      imageUrls: [{ id: '3', url: '/default-image.png' }],
      user: {
        id: '3',
        username: '天神次郎',
        profileImageUrl: '/default-image.png',
        role: 'user',
      },
    },
  ],
};

// RecommendedSpotsのモックデータ
export const mockRecommendedSpots = {
  spots: [
    {
      id: '1',
      spotName: '博多屋台街',
      spotType: 'グルメ',
      address: '福岡市博多区中洲',
      reviewRating: 4.5,
      reviewCount: 350,
      imageUrl: { id: '1', url: '/default-image.png' },
      district: { districtName: '博多区' },
      categories: [{ name: 'グルメ' }],
    },
    {
      id: '2',
      spotName: '大濠公園',
      spotType: '公園',
      address: '福岡市中央区大濠公園',
      reviewRating: 4.7,
      reviewCount: 520,
      imageUrl: { id: '2', url: '/default-image.png' },
      district: { districtName: '中央区' },
      categories: [{ name: '公園' }],
    },
    {
      id: '3',
      spotName: 'キャナルシティ博多',
      spotType: 'ショッピング',
      address: '福岡市博多区住吉',
      reviewRating: 4.3,
      reviewCount: 890,
      imageUrl: { id: '3', url: '/default-image.png' },
      district: { districtName: '博多区' },
      categories: [{ name: 'ショッピング' }],
    },
    {
      id: '4',
      spotName: '福岡タワー',
      spotType: '観光',
      address: '福岡市早良区百道浜',
      reviewRating: 4.4,
      reviewCount: 670,
      imageUrl: { id: '4', url: '/default-image.png' },
      district: { districtName: '早良区' },
      categories: [{ name: '観光' }],
    },
    {
      id: '5',
      spotName: '太宰府天満宮',
      spotType: '神社',
      address: '太宰府市宰府',
      reviewRating: 4.8,
      reviewCount: 1200,
      imageUrl: { id: '5', url: '/default-image.png' },
      district: { districtName: '太宰府市' },
      categories: [{ name: '神社' }],
    },
  ],
};

// RecommendedEventsのモックデータ
export const mockRecommendedEvents = {
  events: [
    {
      id: '1',
      title: '博多どんたく港まつり',
      location: '福岡市内各所',
      startDatetime: '2025-05-03T10:00:00Z',
      endDatetime: '2025-05-04T21:00:00Z',
      bannerImage: '/default-image.png',
      isOnline: false,
      eventCategory: { id: '1', name: 'フェスティバル' },
    },
    {
      id: '2',
      title: '福岡アジア美術館 特別展',
      location: '福岡アジア美術館',
      startDatetime: '2025-04-01T09:00:00Z',
      endDatetime: '2025-06-30T17:00:00Z',
      bannerImage: '/default-image.png',
      isOnline: false,
      eventCategory: { id: '2', name: '展示会' },
    },
    {
      id: '3',
      title: 'オンライン料理教室 博多料理入門',
      location: 'オンライン',
      startDatetime: '2025-04-15T14:00:00Z',
      endDatetime: '2025-04-15T16:00:00Z',
      bannerImage: '/default-image.png',
      isOnline: true,
      eventCategory: { id: '3', name: 'ワークショップ' },
    },
  ],
};

// Apollo Clientモック配列
export const homePageMocks = [
  {
    request: {
      query: GET_PLAY_PLANS,
      variables: { limit: 5, isRecommended: true },
    },
    result: {
      data: mockPlayPlans,
    },
  },
  {
    request: {
      query: GET_RECOMMENDED_SPOTS,
    },
    result: {
      data: mockRecommendedSpots,
    },
  },
  {
    request: {
      query: GET_RECOMMENDED_EVENTS,
    },
    result: {
      data: mockRecommendedEvents,
    },
  },
];
