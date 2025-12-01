import type { Meta, StoryObj } from '@storybook/react';
import PrivacyPolicyPage from './page';

const meta = {
  title: 'Pages/Frontend/PrivacyPolicy',
  component: PrivacyPolicyPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PrivacyPolicyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * プライバシーポリシーページの基本的な表示状態
 */
export const Default: Story = {};
