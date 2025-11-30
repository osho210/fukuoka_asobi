import type { Meta, StoryObj } from '@storybook/react';
import MyPage from './page';
import { myPageMocks, myPagePaidMocks } from '@/stories/mocks/mypage';

const meta = {
  title: 'Pages/Frontend/MyPage',
  component: MyPage,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: myPageMocks,
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示（無料会員）
 * マイページの基本的な表示状態
 */
export const Default: Story = {};

/**
 * 有料会員ユーザー
 */
export const PaidMember: Story = {
  parameters: {
    apolloMocks: myPagePaidMocks,
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  parameters: {
    apolloMocks: [
      {
        ...myPageMocks[0],
        delay: 100000,
      },
    ],
  },
};
