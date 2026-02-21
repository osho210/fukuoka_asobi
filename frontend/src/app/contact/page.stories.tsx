import type { Meta, StoryObj } from '@storybook/nextjs';
import ContactPage from './page';

const meta = {
  title: 'Pages/Frontend/Contact',
  component: ContactPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContactPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * お問い合わせページの基本的な表示状態
 */
export const Default: Story = {};
