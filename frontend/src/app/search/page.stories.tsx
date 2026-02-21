import type { Meta, StoryObj } from '@storybook/nextjs';
import SearchPage from './page';

const meta = {
  title: 'Pages/Frontend/Search',
  component: SearchPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * 検索ページの基本的な表示状態
 */
export const Default: Story = {};
