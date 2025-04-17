// 認証関連のユーティリティ関数

/**
 * ユーザーがログインしているかどうかを確認する
 * @returns ログインしている場合はtrue、していない場合はfalse
 */
export const isLoggedIn = (): boolean => {
  // クライアントサイドでのみ実行
  if (typeof window === 'undefined') return false;

  // JWTトークンの存在を確認
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * ログインモーダルを表示するためのイベントを発火する
 */
export const showLoginModal = (): void => {
  // カスタムイベントを発火
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('show-login-modal');
    window.dispatchEvent(event);
  }
};

/**
 * 認証が必要な操作を実行する前に認証状態をチェックする
 * @param callback 認証されている場合に実行するコールバック関数
 * @returns 認証されている場合はコールバックの結果、されていない場合はログインモーダルを表示
 */
export const withAuth = <T>(callback: () => T): T | void => {
  if (isLoggedIn()) {
    return callback();
  } else {
    showLoginModal();
    return;
  }
};
