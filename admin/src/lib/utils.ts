import { type ClassValue, clsx } from 'clsx';

/**
 * クラス名を結合するユーティリティ関数
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * ISO8601形式の日付文字列を日本時間のyyyy/mm/dd形式に変換する
 * @param dateString ISO8601形式の日付文字列（例: 2025-04-11T14:30:07+09:00）
 * @returns yyyy/mm/dd形式の日付文字列（例: 2025/04/11）
 */
export function formatDateToJst(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  // 無効な日付の場合は空文字列を返す
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  // 月と日は0埋めして2桁にする
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

/**
 * ISO8601形式の日付文字列を日本時間のyyyy/mm/dd HH:MM形式に変換する
 * @param dateString ISO8601形式の日付文字列（例: 2025-04-11T14:30:07+09:00）
 * @returns yyyy/mm/dd HH:MM形式の日付文字列（例: 2025/04/11 14:30）
 */
export function formatDateTimeToJapanese(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  // 無効な日付の場合は空文字列を返す
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  // 月と日は0埋めして2桁にする
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // 時と分も0埋めして2桁にする
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

/**
 * 日本時間のyyyy/mm/dd形式の日付文字列をISO8601形式に変換する
 * @param dateString yyyy/mm/dd形式の日付文字列（例: 2025/04/11）
 * @returns ISO8601形式の日付文字列（例: 2025-04-11T00:00:00+09:00）
 */
export function parseJapaneseDate(dateString: string): string {
  if (!dateString) return '';

  // yyyy/mm/dd形式をyyyy-mm-ddに変換
  const normalizedDate = dateString.replace(/\//g, '-');

  // 日本時間のタイムゾーンを設定
  const date = new Date(`${normalizedDate}T00:00:00+09:00`);

  // 無効な日付の場合は空文字列を返す
  if (isNaN(date.getTime())) return '';

  return date.toISOString();
}
