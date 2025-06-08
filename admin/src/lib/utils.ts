import { type ClassValue, clsx } from 'clsx';

/**
 * クラス名を結合するユーティリティ関数
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
