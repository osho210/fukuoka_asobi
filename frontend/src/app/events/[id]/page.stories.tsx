import type { Meta, StoryObj } from '@storybook/react';
import { GET_EVENT } from '@graphql/queries/getEvent';
import EventDetailContainer from './event-detail.container';

// モックイベントデータ
const mockEvent = {
  id: '1',
  title: '福岡クラフトビアフェスティバル',
  description: '福岡市内外のクラフトビールブルワリーが集結する九州最大級のビールイベント。国内外の厳選されたクラフトビールが楽しめます。',
  location: '福岡市中央区天神 天神中央公園',
  latitude: 33.5904,
  longitude: 130.3989,
  startDatetime: '2025-04-01T10:00:00Z',
  endDatetime: '2025-04-03T18:00:00Z',
  recurringRule: null,
  price: '入場無料（飲食は有料）',
  organizer: '福岡クラフトビール協会',
  contactEmail: 'info@fukuoka-craft-beer.example.com',
  contactPhone: '092-XXX-XXXX',
  capacity: 5000,
  isOnline: false,
  sourceUrl: 'https://example.com/event',
  bannerImage: '/itoshima.png',
  status: 'PUBLISHED',
  eventCategory: {
    id: '1',
    name: 'フェス・マーケット',
    description: 'フェスやマーケットイベント',
  },
  eventCategoryId: '1',
  createdAt: '2025-03-01T00:00:00Z',
  updatedAt: '2025-03-15T00:00:00Z',
};

const eventMocks = [
  {
    request: {
      query: GET_EVENT,
      variables: { id: '1' },
    },
    result: {
      data: { event: mockEvent },
    },
  },
  {
    request: {
      query: GET_EVENT,
      variables: { id: '2' },
    },
    result: {
      data: {
        event: {
          ...mockEvent,
          id: '2',
          title: '糸島ファーマーズマーケット',
          description: '糸島の新鮮な農産物や海産物、加工品などを販売する定期市。',
          location: '糸島市二丈福井 ファームパーク伊都国',
        },
      },
    },
  },
];

const meta = {
  title: 'Pages/Frontend/Events/Detail',
  component: EventDetailContainer,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: eventMocks,
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
        ...eventMocks[0],
        delay: 100000,
      },
    ],
  },
};
