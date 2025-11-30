import type { Meta, StoryObj } from '@storybook/react';
import { GET_EVENT } from '@/graphql/queries/getEvent';
import EventDetailContainer from './event-detail.container';

// モックイベントデータ
const mockEvent = {
  id: '1',
  title: '博多どんたく港まつり',
  description: '博多を代表する春の祭り。市内各所でパレードや舞台が開催されます。',
  location: '福岡市内各所',
  latitude: 33.5904,
  longitude: 130.4017,
  startDatetime: '2025-05-03T10:00:00Z',
  endDatetime: '2025-05-04T21:00:00Z',
  recurringRule: null,
  price: 0,
  organizer: '福岡市民の祭り振興会',
  contactEmail: 'info@dontaku.jp',
  contactPhone: '092-XXX-XXXX',
  capacity: null,
  isOnline: false,
  sourceUrl: 'https://example.com/dontaku',
  bannerImage: '/itoshima.png',
  status: 'PUBLISHED',
  eventCategory: {
    id: '1',
    name: 'フェスティバル',
    description: '地域のお祭りやフェスティバル',
  },
  eventCategoryId: '1',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
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
          title: '福岡アジア美術館 特別展',
          description: 'アジアの現代アートを紹介する特別展覧会です。',
          location: '福岡アジア美術館',
          startDatetime: '2025-04-01T09:00:00Z',
          endDatetime: '2025-06-30T17:00:00Z',
          price: 1000,
          eventCategory: {
            id: '2',
            name: '展示会',
            description: '美術館や博物館の展示会',
          },
          eventCategoryId: '2',
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
