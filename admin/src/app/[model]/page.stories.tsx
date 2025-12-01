import type { Meta, StoryObj } from '@storybook/react';
import ModelListPage from './page';

const meta = {
  title: 'Pages/Admin/Model/List',
  component: ModelListPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/spots',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ModelListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * スポット一覧
 * spotsモデルの一覧表示
 */
export const Spots: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/spots',
        query: {},
      },
    },
  },
};

/**
 * カテゴリー一覧
 * categoriesモデルの一覧表示
 */
export const Categories: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/categories',
        query: {},
      },
    },
  },
};

/**
 * エリア一覧
 * areasモデルの一覧表示
 */
export const Areas: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/areas',
        query: {},
      },
    },
  },
};
