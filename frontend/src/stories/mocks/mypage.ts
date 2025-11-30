/**
 * マイページ用モックデータ
 */
import { GET_CURRENT_USER } from '@/graphql/mypage';

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
