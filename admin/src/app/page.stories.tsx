import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from './page';
import { GET_DASHBOARD_STATS, mockDashboardStats } from '@/stories/mocks/dashboard';

const meta = {
  title: 'Pages/Admin/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * ダッシュボードページの基本的な表示状態（データあり）
 */
export const Default: Story = {
  parameters: {
    apolloMocks: [
      {
        request: {
          query: GET_DASHBOARD_STATS,
        },
        result: {
          data: mockDashboardStats,
        },
      },
    ],
  },
};

/**
 * ローディング状態
 * データ取得中の表示
 */
export const Loading: Story = {
  parameters: {
    apolloMocks: [
      {
        request: {
          query: GET_DASHBOARD_STATS,
        },
        result: {
          data: mockDashboardStats,
        },
        delay: 100000, // 長いdelayでローディング状態を維持
      },
    ],
  },
};

/**
 * エラー状態
 * データ取得に失敗した場合の表示
 */
export const Error: Story = {
  parameters: {
    apolloMocks: [
      {
        request: {
          query: GET_DASHBOARD_STATS,
        },
        result: {
          errors: [{ message: 'データの取得に失敗しました' }],
        },
      },
    ],
  },
};
