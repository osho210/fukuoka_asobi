import type { Meta, StoryObj } from '@storybook/react';
import PlanDetailContainer from './plan-detail.container';
import { planDetailMocks } from '@/stories/mocks/plans';

const meta = {
  title: 'Pages/Frontend/Plans/Detail',
  component: PlanDetailContainer,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: planDetailMocks,
  },
  tags: ['autodocs'],
  argTypes: {
    planId: {
      control: 'text',
      description: 'プランID',
    },
  },
} satisfies Meta<typeof PlanDetailContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * プラン詳細ページの基本的な表示状態
 */
export const Default: Story = {
  args: {
    planId: '1',
  },
};

/**
 * 別のプラン
 */
export const Plan2: Story = {
  args: {
    planId: '2',
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  args: {
    planId: '1',
  },
  parameters: {
    apolloMocks: [
      {
        ...planDetailMocks[0],
        delay: 100000,
      },
    ],
  },
};
