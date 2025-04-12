/**
 * パスワードリセット関連のAPI呼び出し
 */

import { apiClient } from '@/lib/api/client';

/**
 * パスワードリセットリクエスト
 * @param email メールアドレス
 * @returns レスポンス
 */
export const requestPasswordReset = async (email: string) => {
  try {
    // Content-Typeを明示的に設定
    const response = await apiClient.post('/password/forgot', { email }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('パスワードリセットリクエストエラー:', error);
    throw error;
  }
};

/**
 * パスワードリセット実行
 * @param token リセットトークン
 * @param password 新しいパスワード
 * @returns レスポンス
 */
export const resetPassword = async (token: string, password: string, passwordConfirmation: string) => {
  try {
    // Content-Typeを明示的に設定
    const response = await apiClient.post('/password/reset', { token, password, password_confirmation: passwordConfirmation }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('パスワードリセット実行エラー:', error);
    throw error;
  }
};
