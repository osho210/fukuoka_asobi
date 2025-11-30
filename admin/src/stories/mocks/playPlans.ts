/**
 * Admin Play Plansページ用モックデータ
 */
import { GET_PLAY_PLANS } from '@/graphql/queries/getPlayPlans';

// プランのモックデータ
export const mockAdminPlayPlans = [
  {
    id: '1',
    planName: '博多満喫日帰りプラン',
    catchCopy: '博多の魅力を1日で堪能',
    subtitle: '屋台グルメから観光まで',
    leadText: '博多の人気スポットを効率よく巡るプランです',
    description: '博多の観光スポットを効率よく回るプランです。屋台グルメと観光を楽しめます。',
    imageUrl: '/itoshima.png',
    departure: '博多駅',
    departureTime: '09:00',
    travelMethodToFirstSpot: '徒歩',
    travelTimeToFirstSpot: 10,
    imageUrls: [{ id: '1', url: '/itoshima.png' }],
    imageProperties: [],
    userId: '1',
    location: '博多区',
    tripType: 'DAY_TRIP',
    totalBudget: 5000,
    rating: 4.5,
    reviewCount: 120,
    favoriteCount: 45,
    isFavorite: false,
    status: 'PUBLISHED',
    startTime: '09:00',
    endTime: '18:00',
    tags: '博多,グルメ,観光',
    recommendUsers: ['1', '2'],
    plannerTitle: '編集部',
    plannerDescription: '福岡遊び日記編集部',
    planDetails: [
      {
        id: '1',
        stepNumber: 1,
        stepName: '博多駅出発',
        stepDescription: '博多駅から散策開始',
        comment: 'まずは博多駅周辺を散策',
        startTime: '09:00',
        endTime: '10:00',
        durationMinutes: 60,
        plannerTitle: '出発',
        budget: 0,
        notes: '',
        spot: null,
        travelDetails: [],
      },
    ],
    user: {
      id: '1',
      username: '福岡太郎',
    },
    updatedAt: '2025-03-20T10:00:00Z',
  },
  {
    id: '2',
    planName: '糸島ドライブプラン',
    catchCopy: '糸島の海を満喫',
    subtitle: 'カフェ巡りと絶景ドライブ',
    leadText: '糸島の海沿いを楽しむドライブプラン',
    description: '糸島の海沿いを楽しむドライブプラン。おしゃれなカフェ巡りも。',
    imageUrl: '/itoshima.png',
    departure: '天神駅',
    departureTime: '10:00',
    travelMethodToFirstSpot: '車',
    travelTimeToFirstSpot: 45,
    imageUrls: [{ id: '2', url: '/itoshima.png' }],
    imageProperties: [],
    userId: '2',
    location: '糸島市',
    tripType: 'DAY_TRIP',
    totalBudget: 8000,
    rating: 4.8,
    reviewCount: 85,
    favoriteCount: 62,
    isFavorite: true,
    status: 'DRAFT',
    startTime: '10:00',
    endTime: '19:00',
    tags: '糸島,ドライブ,カフェ',
    recommendUsers: ['3'],
    plannerTitle: '編集部',
    plannerDescription: '福岡遊び日記編集部',
    planDetails: [],
    user: {
      id: '2',
      username: '糸島花子',
    },
    updatedAt: '2025-03-18T14:00:00Z',
  },
];

// Apollo Clientモック配列
export const adminPlayPlansMocks = [
  {
    request: {
      query: GET_PLAY_PLANS,
    },
    result: {
      data: {
        playPlans: mockAdminPlayPlans,
      },
    },
  },
];
