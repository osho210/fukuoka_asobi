import type { Meta, StoryObj } from '@storybook/react';
import EventsPage from './page';

const meta = {
  title: 'Pages/Frontend/Events',
  component: EventsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * イベント一覧ページの基本的な表示状態
 */
export const Default: Story = {};
