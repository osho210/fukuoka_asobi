/**
 * ニュースページ用モックデータ
 */
import { GET_NEWS_LIST } from '@/graphql/queries/getNewsList';

// ニュースカテゴリーのモックデータ
export const mockNewsCategories = [
  { id: '1', name: 'イベント' },
  { id: '2', name: 'グルメ' },
  { id: '3', name: '観光' },
  { id: '4', name: 'お知らせ' },
];

// ニュースのモックデータ（一覧用）
export const mockNews = [
  {
    id: '1',
    title: '福岡の新しい観光スポット「福岡タワーパーク」がオープン',
    body: '福岡市内に新しい複合施設が誕生しました。展望台やショッピング、グルメを一度に楽しめます。',
    publishedAt: '2025-03-20T10:00:00Z',
    status: 'published',
    imageUrl: '/default-image.png',
    category: { id: '3', name: '観光', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    author: { id: '1', username: '福岡太郎', profileImageUrl: '/default-image.png', email: 'test@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
  },
  {
    id: '2',
    title: '福岡グルメフェスティバル2025の開催が決定',
    body: '今年も福岡の美味しいグルメが一堂に会するフェスティバルが開催されます。',
    publishedAt: '2025-03-15T09:00:00Z',
    status: 'published',
    imageUrl: '/default-image.png',
    category: { id: '1', name: 'イベント', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    author: { id: '2', username: '博多次郎', profileImageUrl: '/default-image.png', email: 'hakata@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-03-15T09:00:00Z',
  },
  {
    id: '3',
    title: '福岡市内の公園でナイトピクニックイベントを開催',
    body: '暖かい季節に向けて、福岡市内の公園でナイトピクニックイベントが企画されています。',
    publishedAt: '2025-03-13T14:00:00Z',
    status: 'published',
    imageUrl: '/default-image.png',
    category: { id: '1', name: 'イベント', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    author: { id: '1', username: '福岡太郎', profileImageUrl: '/default-image.png', email: 'test@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    createdAt: '2025-03-13T14:00:00Z',
    updatedAt: '2025-03-13T14:00:00Z',
  },
  {
    id: '4',
    title: '糸島の新しい隠れ家カフェがオープン',
    body: '糸島の海沿いに、絶景を楽しめる新しいカフェがオープンしました。',
    publishedAt: '2025-03-10T11:00:00Z',
    status: 'published',
    imageUrl: '/default-image.png',
    category: { id: '2', name: 'グルメ', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    author: { id: '3', username: '糸島花子', profileImageUrl: '/default-image.png', email: 'itoshima@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    createdAt: '2025-03-10T11:00:00Z',
    updatedAt: '2025-03-10T11:00:00Z',
  },
];

// ニュース詳細用モックデータ
export const mockNewsDetail = {
  id: '1',
  title: '福岡の新しい観光スポット「福岡タワーパーク」がオープン',
  body: '福岡市内に新しい複合施設が誕生しました。展望台やショッピング、グルメを一度に楽しめます。\n\n福岡タワーパークは、福岡タワーを中心に整備された新しい複合施設です。展望台からは福岡市内を一望でき、夜景も楽しめます。\n\n施設内には、地元の人気店が出店するフードコートや、お土産ショップも充実しています。',
  publishedAt: '2025-03-20T10:00:00Z',
  status: 'published',
  imageUrl: '/default-image.png',
  category: { id: '3', name: '観光', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  author: { id: '1', username: '福岡太郎', profileImageUrl: '/default-image.png', email: 'test@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  createdAt: '2025-03-20T10:00:00Z',
  updatedAt: '2025-03-20T10:00:00Z',
};

// Apollo Clientモック配列（一覧ページ用）
export const newsPageMocks = [
  {
    request: {
      query: GET_NEWS_LIST,
      variables: { categoryId: null, limit: 20 },
    },
    result: {
      data: {
        news: mockNews,
        categories: mockNewsCategories,
      },
    },
  },
];

// Apollo Clientモック配列（詳細ページ用）
export const newsDetailMocks = [
  {
    request: {
      query: GET_NEWS_LIST,
      variables: { id: '1' },
    },
    result: {
      data: {
        news: [mockNewsDetail],
        categories: [],
      },
    },
  },
  {
    request: {
      query: GET_NEWS_LIST,
      variables: { id: '2' },
    },
    result: {
      data: {
        news: [{
          ...mockNewsDetail,
          id: '2',
          title: '福岡グルメフェスティバル2025の開催が決定',
          body: '今年も福岡の美味しいグルメが一堂に会するフェスティバルが開催されます。\n\n開催日程や参加店舗の情報は順次公開予定です。',
          category: { id: '1', name: 'イベント', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
        }],
        categories: [],
      },
    },
  },
];
