import type { Meta, StoryObj } from '@storybook/nextjs';
import NewPlayPlanPage from './page';

const meta = {
  title: 'Pages/Admin/PlayPlans/New',
  component: NewPlayPlanPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewPlayPlanPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * 新規プラン作成ページの基本的な表示状態
 */
export const Default: Story = {};

/**
 * ローディング状態
 * オプションデータの読み込み中
 */
export const Loading: Story = {
  parameters: {
    apolloMocks: [],
  },
};
