import type { Meta, StoryObj } from '@storybook/react';
import CategoryPage from './page';

// Server Component のため、実際のレンダリングはnextjs frameworkに依存
const meta = {
  title: 'Pages/Frontend/Events/Categories',
  component: CategoryPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/events/categories/[id]',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * フェス・マーケット カテゴリ
 */
export const FestivalMarket: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/events/categories/1',
        query: { id: '1' },
      },
    },
  },
};

/**
 * 展示会・ギャラリー カテゴリ
 */
export const Exhibition: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/events/categories/2',
        query: { id: '2' },
      },
    },
  },
};

/**
 * ワークショップ カテゴリ
 */
export const Workshop: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/events/categories/3',
        query: { id: '3' },
      },
    },
  },
};
