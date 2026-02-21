import type { Meta, StoryObj } from '@storybook/nextjs';
import SpotsPage from './page';
import { spotsPageMocks } from '@/stories/mocks/spots';

const meta = {
  title: 'Pages/Frontend/Spots',
  component: SpotsPage,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: spotsPageMocks,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SpotsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * スポット一覧ページの基本的な表示状態
 */
export const Default: Story = {};

/**
 * ローディング状態
 */
export const Loading: Story = {
  parameters: {
    apolloMocks: [
      {
        ...spotsPageMocks[0],
        delay: 100000,
      },
    ],
  },
};
