import type { Meta, StoryObj } from '@storybook/nextjs';
import SitemapPage from './page';

const meta = {
  title: 'Pages/Frontend/Sitemap',
  component: SitemapPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SitemapPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * サイトマップページの基本的な表示状態
 */
export const Default: Story = {};
