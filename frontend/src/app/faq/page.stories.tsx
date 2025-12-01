import type { Meta, StoryObj } from '@storybook/react';
import FAQPage from './page';

const meta = {
  title: 'Pages/Frontend/FAQ',
  component: FAQPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FAQPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * よくある質問ページの基本的な表示状態
 */
export const Default: Story = {};
