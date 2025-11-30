import type { Meta, StoryObj } from '@storybook/react';
import { GET_NEWS_LIST } from '@/graphql/queries/getNewsList';
import NewsDetailContainer from './news-detail.container';

// モックニュースデータ
const mockNewsItem = {
  id: '1',
  title: '福岡の新しい観光スポット「福岡タワーパーク」がオープン',
  body: '福岡市内に新しい複合施設が誕生しました。展望台やショッピング、グルメを一度に楽しめます。\n\n福岡タワーパークは、福岡タワーを中心に整備された新しい複合施設です。展望台からは福岡市内を一望でき、夜景も楽しめます。\n\n施設内には、地元の人気店が出店するフードコートや、お土産ショップも充実しています。',
  publishedAt: '2025-03-20T10:00:00Z',
  status: 'published',
  imageUrl: '/itoshima.png',
  category: { id: '3', name: '観光', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  author: { id: '1', username: '福岡太郎', profileImageUrl: '/itoshima.png', email: 'test@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  createdAt: '2025-03-20T10:00:00Z',
  updatedAt: '2025-03-20T10:00:00Z',
};

const newsMocks = [
  {
    request: {
      query: GET_NEWS_LIST,
      variables: { id: '1' },
    },
    result: {
      data: {
        news: [mockNewsItem],
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
          ...mockNewsItem,
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

const meta = {
  title: 'Pages/Frontend/News/Detail',
  component: NewsDetailContainer,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: newsMocks,
  },
  tags: ['autodocs'],
  argTypes: {
    newsId: {
      control: 'text',
      description: 'ニュースID',
    },
  },
} satisfies Meta<typeof NewsDetailContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * ニュース詳細ページの基本的な表示状態
 */
export const Default: Story = {
  args: {
    newsId: '1',
  },
};

/**
 * 別のニュース
 */
export const News2: Story = {
  args: {
    newsId: '2',
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  args: {
    newsId: '1',
  },
  parameters: {
    apolloMocks: [
      {
        ...newsMocks[0],
        delay: 100000,
      },
    ],
  },
};
