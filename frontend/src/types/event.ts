/**
 * イベントカテゴリの型定義
 */
export type EventCategory = {
  id: string;
  name: string;
  description: string | null;
  events?: Event[];
  createdAt: string;
  updatedAt: string;
};

/**
 * イベントの型定義
 */
export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  startDatetime: string;
  endDatetime: string;
  recurringRule: string | null;
  eventCategory: EventCategory;
  eventCategoryId: string;
  price: string | null;
  organizer: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  capacity: number | null;
  status: EventStatus;
  isOnline: boolean;
  sourceUrl: string | null;
  bannerImage: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * イベントステータスの型定義
 */
export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELED = 'CANCELED'
}

/**
 * イベント一覧取得用のフィルタ型定義
 */
export type EventFilter = {
  categoryId?: string;
  status?: EventStatus;
  isOnline?: boolean;
  upcoming?: boolean;
  limit?: number;
};

/**
 * イベント一覧の型定義
 */
export type EventListResponse = {
  events: Event[];
  totalCount: number;
};

/**
 * イベントカテゴリ一覧の型定義
 */
export type EventCategoryListResponse = {
  eventCategories: EventCategory[];
};
