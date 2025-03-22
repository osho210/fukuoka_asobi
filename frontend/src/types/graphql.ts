/**
 * GraphQLの型定義
 */

// テーマオプションの型
export interface ThemeOption {
  id: string;
  label: string;
}

// 移動手段オプションの型
export interface TransportationOption {
  id: string;
  label: string;
}

// カテゴリーオプションの型
export interface CategoryOption {
  id: string;
  label: string;
}

// GetOptionsクエリのレスポンス型
export interface GetOptionsResponse {
  themeOptions: ThemeOption[];
  transportationOptions: TransportationOption[];
  categoryOptions: CategoryOption[];
}
