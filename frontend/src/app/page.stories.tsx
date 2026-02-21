import type { Meta, StoryObj } from '@storybook/nextjs';
import Home from './page';
import { homePageMocks } from '@/stories/mocks/home';

const meta = {
  title: 'Pages/Frontend/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: homePageMocks,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * トップページの基本的な表示状態
 */
export const Default: Story = {};
