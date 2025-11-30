import type { Meta, StoryObj } from '@storybook/react';
import { GET_CATEGORIES } from '@/graphql/queries/getCategories';
import Categories from './Categories';

// モックカテゴリーデータ
const mockCategories = [
  {
    id: '1',
    name: 'グルメ',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '観光',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'ショッピング',
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: '公園',
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'カフェ',
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
  },
];

const categoriesMocks = [
  {
    request: {
      query: GET_CATEGORIES,
    },
    result: {
      data: { categories: mockCategories },
    },
  },
];

const meta = {
  title: 'Components/Categories',
  component: Categories,
  parameters: {
    apolloMocks: categoriesMocks,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Categories>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * カテゴリー一覧の基本的な表示状態
 */
export const Default: Story = {};

/**
 * ローディング状態
 */
export const Loading: Story = {
  parameters: {
    apolloMocks: [
      {
        ...categoriesMocks[0],
        delay: 100000,
      },
    ],
  },
};

/**
 * エラー状態
 */
export const ErrorState: Story = {
  parameters: {
    apolloMocks: [
      {
        request: {
          query: GET_CATEGORIES,
        },
        error: new Error('カテゴリーの取得に失敗しました'),
      },
    ],
  },
};

/**
 * 空のカテゴリーリスト
 */
export const Empty: Story = {
  parameters: {
    apolloMocks: [
      {
        request: {
          query: GET_CATEGORIES,
        },
        result: {
          data: { categories: [] },
        },
      },
    ],
  },
};
