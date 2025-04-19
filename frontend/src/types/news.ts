/**
 * カテゴリの型定義
 */
export type Category = {
  id: string;
  name: string;
};

/**
 * 著者の型定義
 */
export type Author = {
  id: string;
  username: string;
  profileImageUrl?: string | null;
};

/**
 * ニュースの型定義
 */
export type News = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  status: NewsStatus;
  imageUrl?: string | null;
  category?: Category | null;
  author?: Author | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * ニュースステータスの型定義
 */
export enum NewsStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

/**
 * ニュース一覧取得用のフィルタ型定義
 */
export type NewsFilter = {
  categoryId?: string;
  status?: NewsStatus;
  limit?: number;
};

/**
 * ニュース一覧の型定義
 */
export type NewsListResponse = {
  news: News[];
  totalCount: number;
};

/**
 * カテゴリ一覧の型定義
 */
export type CategoryListResponse = {
  categories: Category[];
};
