/**
 * マイページ用モックデータ
 */
import { GET_CURRENT_USER, GET_USER_PLAY_PLANS } from '@/graphql/mypage';
import { GET_USER_BOOKMARKS } from '@/graphql/bookmarks';

// ログインユーザーのモックデータ
export const mockCurrentUser = {
  id: '1',
  username: '福岡太郎',
  email: 'fukuoka@example.com',
  profileImageUrl: '/itoshima.png',
  bio: '福岡が大好きな博多っ子です。週末は福岡の隠れスポットを巡っています。',
  instagramUrl: 'https://instagram.com/fukuoka_taro',
  isPaidMember: false,
  paidStartDate: null,
  paidEndDate: null,
  avatarUrl: '/itoshima.png',
};

// 有料会員ユーザーのモックデータ
export const mockPaidUser = {
  ...mockCurrentUser,
  id: '2',
  username: '糸島花子',
  email: 'itoshima@example.com',
  isPaidMember: true,
  paidStartDate: '2025-01-01',
  paidEndDate: '2025-12-31',
};

// ユーザーのプランモックデータ
export const mockUserPlans = [
  {
    id: '1',
    planName: '博多満喫日帰りプラン',
    description: '博多の観光スポットを効率よく回るプランです。',
    imageUrl: '/itoshima.png',
    status: 'PUBLISHED',
    createdAt: '2025-01-15T00:00:00Z',
    totalBudget: 5000,
  },
  {
    id: '2',
    planName: '糸島ドライブプラン',
    description: '糸島の海沿いを楽しむドライブプラン。',
    imageUrl: '/itoshima.png',
    status: 'DRAFT',
    createdAt: '2025-01-10T00:00:00Z',
    totalBudget: 8000,
  },
];

// ユーザーのブックマークモックデータ
export const mockUserBookmarks = [
  {
    id: '1',
    playPlan: {
      id: '3',
      planName: '天神ショッピング&グルメ',
      description: '天神エリアでショッピングとグルメを堪能するプランです。',
      imageUrl: '/itoshima.png',
      location: '中央区',
      totalBudget: 10000,
      rating: 4.2,
      reviewCount: 200,
      user: {
        id: '3',
        username: '天神次郎',
        profileImageUrl: '/itoshima.png',
      },
    },
    createdAt: '2025-01-20T00:00:00Z',
  },
];

// Apollo Clientモック配列
export const myPageMocks = [
  {
    request: {
      query: GET_CURRENT_USER,
    },
    result: {
      data: {
        currentUser: mockCurrentUser,
      },
    },
  },
  {
    request: {
      query: GET_USER_PLAY_PLANS,
      variables: { limit: 20 },
    },
    result: {
      data: {
        userPlayPlans: mockUserPlans,
      },
    },
  },
  {
    request: {
      query: GET_USER_BOOKMARKS,
      variables: { limit: 20 },
    },
    result: {
      data: {
        userBookmarks: mockUserBookmarks,
      },
    },
  },
];

// 有料会員用モック
export const myPagePaidMocks = [
  {
    request: {
      query: GET_CURRENT_USER,
    },
    result: {
      data: {
        currentUser: mockPaidUser,
      },
    },
  },
  {
    request: {
      query: GET_USER_PLAY_PLANS,
      variables: { limit: 20 },
    },
    result: {
      data: {
        userPlayPlans: mockUserPlans,
      },
    },
  },
  {
    request: {
      query: GET_USER_BOOKMARKS,
      variables: { limit: 20 },
    },
    result: {
      data: {
        userBookmarks: mockUserBookmarks,
      },
    },
  },
];

// 未ログイン状態モック
export const myPageNotLoggedInMocks = [
  {
    request: {
      query: GET_CURRENT_USER,
    },
    result: {
      data: {
        currentUser: null,
      },
    },
  },
];
