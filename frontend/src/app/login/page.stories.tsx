import type { Meta, StoryObj } from '@storybook/react';
import LoginPage from './page';

const meta = {
  title: 'Pages/Frontend/Login',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * ログインページの基本的な表示状態
 */
export const Default: Story = {};
