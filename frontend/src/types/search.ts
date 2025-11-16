import { BudgetInput, CustomOptionsInput, MemberInfoInput } from '@/__generated__/graphql';

// UI層で使用する検索パラメータの型定義
// GraphQLのInputTypeをラップして、UI固有のフィールドを追加
export interface SearchParams {
  districts: string[]; // 地区ID
  date: string; // 日付（YYYY-MM-DD形式）
  startTime?: string; // 開始時間（HH:MM形式）
  endTime?: string; // 終了時間（HH:MM形式）
  memberInfo: MemberInfoInput; // 利用メンバー情報（GraphQL型）
  budget: BudgetInput; // 予算範囲（GraphQL型）
  customOptions?: CustomOptionsInput; // カスタムオプション（GraphQL型）
  areas?: string[]; // 後方互換性のため残す
}

// 検索結果のスポット情報（UI表示用）
export interface SpotInfo {
  id: string;
  name: string;
  category: string;
  location: string;
}

// 検索結果のプラン情報（UI表示用）
export interface PlanInfo {
  id: string;
  title: string;
  spots: SpotInfo[];
  totalPrice: number;
}

// GraphQL型の再エクスポート（利便性のため）
export type { BudgetInput, CustomOptionsInput, MemberInfoInput };
