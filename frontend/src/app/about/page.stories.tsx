import type { Meta, StoryObj } from '@storybook/nextjs';
import AboutPage from './page';

const meta = {
  title: 'Pages/Frontend/About',
  component: AboutPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * サイトについてページの基本的な表示状態
 */
export const Default: Story = {};
