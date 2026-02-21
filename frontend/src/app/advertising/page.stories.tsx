import type { Meta, StoryObj } from '@storybook/nextjs';
import AdvertisingPage from './page';

const meta = {
  title: 'Pages/Frontend/Advertising',
  component: AdvertisingPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdvertisingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * 広告掲載についてページの基本的な表示状態
 */
export const Default: Story = {};
