import type { Meta, StoryObj } from '@storybook/nextjs';
import EventDetailContainer from './event-detail.container';
import { eventDetailMocks } from '@/stories/mocks/events';

const meta = {
  title: 'Pages/Frontend/Events/Detail',
  component: EventDetailContainer,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: eventDetailMocks,
  },
  tags: ['autodocs'],
  argTypes: {
    eventId: {
      control: 'text',
      description: 'イベントID',
    },
  },
} satisfies Meta<typeof EventDetailContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * イベント詳細ページの基本的な表示状態
 */
export const Default: Story = {
  args: {
    eventId: '1',
  },
};

/**
 * 別のイベント
 */
export const Event2: Story = {
  args: {
    eventId: '2',
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  args: {
    eventId: '1',
  },
  parameters: {
    apolloMocks: [
      {
        ...eventDetailMocks[0],
        delay: 100000,
      },
    ],
  },
};
