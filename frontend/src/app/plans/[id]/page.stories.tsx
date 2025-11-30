import type { Meta, StoryObj } from '@storybook/react';
import { GET_PLAY_PLAN } from '@/graphql/playPlans';
import PlanDetailContainer from './plan-detail.container';

// モックプランデータ
const mockPlayPlan = {
  id: 1,
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
  location: '博多区',
  tripType: 'DAY_TRIP',
  totalBudget: 5000,
  rating: 4.5,
  reviewCount: 120,
  favoriteCount: 45,
  isFavorite: false,
  isRecommended: true,
  status: 'PUBLISHED',
  startTime: '09:00',
  endTime: '18:00',
  tags: '博多,グルメ,観光',
  recommendUsers: ['カップル', 'ファミリー'],
  userId: '1',
  user: {
    id: '1',
    username: '福岡太郎',
    profileImageUrl: '/itoshima.png',
    role: 'editor',
  },
  plannerTitle: '編集部',
  plannerDescription: '福岡遊び日記編集部',
  recommendedFors: [{ id: '1', name: 'カップル' }],
  planDetails: [
    {
      id: '1',
      stepNumber: 1,
      stepName: '博多駅で集合',
      stepDescription: '博多駅筑紫口で待ち合わせ',
      comment: '時間厳守でお願いします',
      startTime: '09:00',
      durationMinutes: 30,
      budget: 0,
      notes: '',
      plannerTitle: '集合',
      plannerDescription: '',
      travelDetails: [],
      spot: null,
    },
    {
      id: '2',
      stepNumber: 2,
      stepName: 'キャナルシティ博多',
      stepDescription: 'ショッピングとランチを楽しむ',
      comment: 'フードコートがおすすめ',
      startTime: '10:00',
      durationMinutes: 180,
      budget: 2000,
      notes: 'ラーメンスタジアムで博多ラーメンを楽しめます',
      plannerTitle: 'ショッピング',
      plannerDescription: '',
      travelDetails: [
        { sequenceNumber: 1, travelMethod: '徒歩', travelTime: 15, notes: '地下道経由' },
      ],
      spot: {
        id: '3',
        spotName: 'キャナルシティ博多',
        description: 'ショッピング、映画、グルメが楽しめる大型複合施設',
        address: '福岡市博多区住吉',
        phoneNumber: '092-XXX-XXXX',
        budgetRange: '3000-10000',
        isRainyOk: true,
        website: 'https://canalcity.co.jp',
        nearestStation: '祇園駅',
        instagramUrl: '',
        reviewCount: 890,
        reviewRating: 4.3,
        acceptsCreditCards: true,
        priceRangeStartAmount: 1000,
        priceRangeEndAmount: 5000,
        takeout: true,
        reservable: false,
        menus: [],
        spotAmbiances: [],
        imageUrl: { id: '1', url: '/itoshima.png' },
        hashtags: [],
        catchphrase: '一日中楽しめる',
        categories: [{ name: 'ショッピング' }],
        openingHours: [],
        district: { districtName: '博多区' },
      },
    },
  ],
};

const planMocks = [
  {
    request: {
      query: GET_PLAY_PLAN,
      variables: { id: 1 },
    },
    result: {
      data: { playPlan: mockPlayPlan },
    },
  },
  {
    request: {
      query: GET_PLAY_PLAN,
      variables: { id: 2 },
    },
    result: {
      data: {
        playPlan: {
          ...mockPlayPlan,
          id: 2,
          planName: '糸島ドライブプラン',
          description: '糸島の海沿いを楽しむドライブプラン。おしゃれなカフェ巡りも。',
          location: '糸島市',
        },
      },
    },
  },
];

const meta = {
  title: 'Pages/Frontend/Plans/Detail',
  component: PlanDetailContainer,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: planMocks,
  },
  tags: ['autodocs'],
  argTypes: {
    planId: {
      control: 'text',
      description: 'プランID',
    },
  },
} satisfies Meta<typeof PlanDetailContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * プラン詳細ページの基本的な表示状態
 */
export const Default: Story = {
  args: {
    planId: '1',
  },
};

/**
 * 別のプラン
 */
export const Plan2: Story = {
  args: {
    planId: '2',
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  args: {
    planId: '1',
  },
  parameters: {
    apolloMocks: [
      {
        ...planMocks[0],
        delay: 100000,
      },
    ],
  },
};
