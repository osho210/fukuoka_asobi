import type { Meta, StoryObj } from '@storybook/react';
import NewsPage from './page';
import { newsPageMocks } from '@/stories/mocks/news';

const meta = {
  title: 'Pages/Frontend/News',
  component: NewsPage,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: newsPageMocks,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * ニュース一覧ページの基本的な表示状態
 */
export const Default: Story = {};

/**
 * ローディング状態
 */
export const Loading: Story = {
  parameters: {
    apolloMocks: [
      {
        ...newsPageMocks[0],
        delay: 100000,
      },
    ],
  },
};
