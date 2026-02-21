import type { Meta, StoryObj } from '@storybook/nextjs';
import PlayPlansPage from './page';
import { adminPlayPlansMocks } from '@/stories/mocks/playPlans';

const meta = {
  title: 'Pages/Admin/PlayPlans',
  component: PlayPlansPage,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: adminPlayPlansMocks,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayPlansPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * 遊びプラン一覧ページの基本的な表示状態
 */
export const Default: Story = {};

/**
 * ローディング状態
 */
export const Loading: Story = {
  parameters: {
    apolloMocks: [
      {
        ...adminPlayPlansMocks[0],
        delay: 100000,
      },
    ],
  },
};

/**
 * エラー状態
 */
export const Error: Story = {
  parameters: {
    apolloMocks: [
      {
        request: adminPlayPlansMocks[0].request,
        result: {
          errors: [{ message: 'データの取得に失敗しました' }],
        },
      },
    ],
  },
};
