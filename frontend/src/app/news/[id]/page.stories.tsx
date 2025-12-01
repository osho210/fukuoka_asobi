import type { Meta, StoryObj } from '@storybook/react';
import NewsDetailContainer from './news-detail.container';
import { newsDetailMocks } from '@/stories/mocks/news';

const meta = {
  title: 'Pages/Frontend/News/Detail',
  component: NewsDetailContainer,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: newsDetailMocks,
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
        ...newsDetailMocks[0],
        delay: 100000,
      },
    ],
  },
};
