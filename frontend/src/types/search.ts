// 検索条件の型定義

// 利用メンバー情報
export interface MemberInfo {
  recommendedForIds: string[];
}

// 予算範囲の入力
export interface BudgetRange {
  min: number;
  max: number;
}

// カスタム検索オプション
export interface CustomOptions {
  transportationMethod?: string; // 移動手段
  theme?: string; // テーマ
  rainyDayOption?: boolean; // 雨天対応
  includeEvents?: boolean; // イベント含む
  startingPoint?: string; // 出発地点
  spotCount?: number; // スポット数
  categories?: string[]; // カテゴリー
}

// 検索条件全体
export interface SearchParams {
  districts: string[]; // 地区ID
  date: string; // 日付（YYYY-MM-DD形式）
  startTime?: string; // 開始時間（HH:MM形式）
  endTime?: string; // 終了時間（HH:MM形式）
  memberInfo: MemberInfo; // 利用メンバー情報
  budget: BudgetRange; // 予算範囲
  customOptions?: CustomOptions; // カスタムオプション
  areas?: string[]; // 後方互換性のため残す
}

// 検索結果のスポット情報
export interface SpotInfo {
  id: string;
  name: string;
  category: string;
  location: string;
}

// 検索結果のプラン情報
export interface PlanInfo {
  id: string;
  title: string;
  spots: SpotInfo[];
  totalPrice: number;
}
