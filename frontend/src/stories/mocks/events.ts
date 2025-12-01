/**
 * イベントページ用モックデータ
 */
import { GET_EVENT } from '@/graphql/queries/getEvent';

// ダミーのイベントカテゴリ
export const mockEventCategories = [
  { id: '1', name: 'フェス・マーケット' },
  { id: '2', name: '展示会・ギャラリー' },
  { id: '3', name: 'ワークショップ' },
  { id: '4', name: 'スポーツ・アウトドア' },
  { id: '5', name: 'グルメ・フード' },
  { id: '6', name: '伝統・文化' },
  { id: '7', name: 'セミナー・講演会' },
  { id: '8', name: 'その他' },
];

// ダミーイベント（一覧用）
export const mockEvents = [
  {
    id: '1',
    title: '福岡クラフトビアフェスティバル',
    description: '福岡市内外のクラフトビールブルワリーが集結する九州最大級のビールイベント。',
    location: '福岡市中央区天神 天神中央公園',
    startDatetime: '2025-04-01T10:00:00Z',
    endDatetime: '2025-04-03T18:00:00Z',
    price: '入場無料（飲食は有料）',
    bannerImage: '',
    isOnline: false,
    status: 'PUBLISHED',
    eventCategory: { id: '1', name: 'フェス・マーケット' },
  },
  {
    id: '2',
    title: '糸島ファーマーズマーケット',
    description: '糸島の新鮮な農産物や海産物、加工品などを販売する定期市。',
    location: '糸島市二丈福井 ファームパーク伊都国',
    startDatetime: '2025-03-25T09:00:00Z',
    endDatetime: '2025-03-25T17:00:00Z',
    price: '入場無料',
    bannerImage: '',
    isOnline: false,
    status: 'PUBLISHED',
    eventCategory: { id: '1', name: 'フェス・マーケット' },
  },
  {
    id: '3',
    title: '福岡アートウィーク',
    description: '福岡市内の美術館やギャラリーが連携して開催する芸術週間。',
    location: '福岡市内各所',
    startDatetime: '2025-04-15T10:00:00Z',
    endDatetime: '2025-04-22T18:00:00Z',
    price: '会場により異なる',
    bannerImage: '',
    isOnline: false,
    status: 'PUBLISHED',
    eventCategory: { id: '2', name: '展示会・ギャラリー' },
  },
  {
    id: '4',
    title: '博多人形絵付け体験',
    description: '伝統工芸品である博多人形の絵付け体験ができるワークショップ。',
    location: '福岡市博多区冷泉町 博多伝統工芸館',
    startDatetime: '2025-03-20T13:00:00Z',
    endDatetime: '2025-03-20T16:00:00Z',
    price: '3,000円（材料費込み）',
    bannerImage: '',
    isOnline: false,
    status: 'PUBLISHED',
    eventCategory: { id: '3', name: 'ワークショップ' },
  },
];

// イベント詳細用モックデータ
export const mockEventDetail = {
  id: '1',
  title: '博多どんたく港まつり',
  description: '博多を代表する春の祭り。市内各所でパレードや舞台が開催されます。',
  location: '福岡市内各所',
  latitude: 33.5904,
  longitude: 130.4017,
  startDatetime: '2025-05-03T10:00:00Z',
  endDatetime: '2025-05-04T21:00:00Z',
  recurringRule: null,
  price: 0,
  organizer: '福岡市民の祭り振興会',
  contactEmail: 'info@dontaku.jp',
  contactPhone: '092-XXX-XXXX',
  capacity: null,
  isOnline: false,
  sourceUrl: 'https://example.com/dontaku',
  bannerImage: '/itoshima.png',
  status: 'PUBLISHED',
  eventCategory: {
    id: '1',
    name: 'フェスティバル',
    description: '地域のお祭りやフェスティバル',
  },
  eventCategoryId: '1',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};

// イベント詳細用Apollo Clientモック配列
export const eventDetailMocks = [
  {
    request: {
      query: GET_EVENT,
      variables: { id: '1' },
    },
    result: {
      data: { event: mockEventDetail },
    },
  },
  {
    request: {
      query: GET_EVENT,
      variables: { id: '2' },
    },
    result: {
      data: {
        event: {
          ...mockEventDetail,
          id: '2',
          title: '福岡アジア美術館 特別展',
          description: 'アジアの現代アートを紹介する特別展覧会です。',
          location: '福岡アジア美術館',
          startDatetime: '2025-04-01T09:00:00Z',
          endDatetime: '2025-06-30T17:00:00Z',
          price: 1000,
          eventCategory: {
            id: '2',
            name: '展示会',
            description: '美術館や博物館の展示会',
          },
          eventCategoryId: '2',
        },
      },
    },
  },
];
