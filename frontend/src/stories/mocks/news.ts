/**
 * ニュース一覧ページ用モックデータ
 */
import { GET_NEWS_LIST } from '@/graphql/queries/getNewsList';

// ニュースカテゴリーのモックデータ
export const mockNewsCategories = [
  { id: '1', name: 'イベント' },
  { id: '2', name: 'グルメ' },
  { id: '3', name: '観光' },
  { id: '4', name: 'お知らせ' },
];

// ニュースのモックデータ
export const mockNews = [
  {
    id: '1',
    title: '福岡の新しい観光スポット「福岡タワーパーク」がオープン',
    body: '福岡市内に新しい複合施設が誕生しました。展望台やショッピング、グルメを一度に楽しめます。',
    publishedAt: '2025-03-20T10:00:00Z',
    status: 'published',
    imageUrl: '/itoshima.png',
    category: { id: '3', name: '観光', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    author: { id: '1', username: '福岡太郎', profileImageUrl: '/itoshima.png', email: 'test@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
  },
  {
    id: '2',
    title: '福岡グルメフェスティバル2025の開催が決定',
    body: '今年も福岡の美味しいグルメが一堂に会するフェスティバルが開催されます。',
    publishedAt: '2025-03-15T09:00:00Z',
    status: 'published',
    imageUrl: '/itoshima.png',
    category: { id: '1', name: 'イベント', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    author: { id: '2', username: '博多次郎', profileImageUrl: '/itoshima.png', email: 'hakata@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-03-15T09:00:00Z',
  },
  {
    id: '3',
    title: '福岡市内の公園でナイトピクニックイベントを開催',
    body: '暖かい季節に向けて、福岡市内の公園でナイトピクニックイベントが企画されています。',
    publishedAt: '2025-03-13T14:00:00Z',
    status: 'published',
    imageUrl: '/itoshima.png',
    category: { id: '1', name: 'イベント', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    author: { id: '1', username: '福岡太郎', profileImageUrl: '/itoshima.png', email: 'test@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    createdAt: '2025-03-13T14:00:00Z',
    updatedAt: '2025-03-13T14:00:00Z',
  },
  {
    id: '4',
    title: '糸島の新しい隠れ家カフェがオープン',
    body: '糸島の海沿いに、絶景を楽しめる新しいカフェがオープンしました。',
    publishedAt: '2025-03-10T11:00:00Z',
    status: 'published',
    imageUrl: '/itoshima.png',
    category: { id: '2', name: 'グルメ', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    author: { id: '3', username: '糸島花子', profileImageUrl: '/itoshima.png', email: 'itoshima@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
    createdAt: '2025-03-10T11:00:00Z',
    updatedAt: '2025-03-10T11:00:00Z',
  },
];

// Apollo Clientモック配列
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
