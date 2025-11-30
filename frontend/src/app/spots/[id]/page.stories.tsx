import type { Meta, StoryObj } from '@storybook/react';
import SpotDetailContainer from './spot-detail.container';
import { spotDetailMocks } from '@/stories/mocks/spots';

const meta = {
  title: 'Pages/Frontend/Spots/Detail',
  component: SpotDetailContainer,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: spotDetailMocks,
  },
  tags: ['autodocs'],
  argTypes: {
    spotId: {
      control: 'text',
      description: 'スポットID',
    },
  },
} satisfies Meta<typeof SpotDetailContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * スポット詳細ページの基本的な表示状態
 */
export const Default: Story = {
  args: {
    spotId: '1',
  },
};

/**
 * 別のスポット
 */
export const Spot2: Story = {
  args: {
    spotId: '2',
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  args: {
    spotId: '1',
  },
  parameters: {
    apolloMocks: [
      {
        ...spotDetailMocks[0],
        delay: 100000,
      },
    ],
  },
};
