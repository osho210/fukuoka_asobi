import type { Meta, StoryObj } from '@storybook/react';
import TermsOfServicePage from './page';

const meta = {
  title: 'Pages/Frontend/TermsOfService',
  component: TermsOfServicePage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TermsOfServicePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * 利用規約ページの基本的な表示状態
 */
export const Default: Story = {};
