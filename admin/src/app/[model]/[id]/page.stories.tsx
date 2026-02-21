import type { Meta, StoryObj } from '@storybook/nextjs';
import ModelDetailPage from './page';

const meta = {
  title: 'Pages/Admin/Model/Detail',
  component: ModelDetailPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/spots/1',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ModelDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 新規スポット作成
 */
export const NewSpot: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/spots/new',
        query: {},
      },
    },
  },
};

/**
 * 新規カテゴリー作成
 */
export const NewCategory: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/categories/new',
        query: {},
      },
    },
  },
};

/**
 * 新規エリア作成
 */
export const NewArea: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/areas/new',
        query: {},
      },
    },
  },
};
