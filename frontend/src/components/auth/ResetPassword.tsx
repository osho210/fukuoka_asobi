/**
 * パスワードリセット実行フォーム
 */
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '../../lib/api/passwordApi';
import '@styles/Auth.css';

/**
 * パスワードリセット実行フォームコンポーネント
 */
export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // トークンの存在確認
  useEffect(() => {
    if (!token) {
      setMessage({
        type: 'error',
        text: '無効なリンクです。パスワードリセットを再度リクエストしてください'
      });
    }
  }, [token]);

  /**
   * フォーム送信ハンドラー
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!token) {
      setMessage({ type: 'error', text: '無効なリンクです。パスワードリセットを再度リクエストしてください' });
      return;
    }

    if (!password) {
      setMessage({ type: 'error', text: '新しいパスワードを入力してください' });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'パスワードは8文字以上で入力してください' });
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage({ type: 'error', text: 'パスワードと確認用パスワードが一致しません' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await resetPassword(token, password, passwordConfirmation);
      setMessage({
        type: 'success',
        text: response.message || 'パスワードが正常に更新されました'
      });

      // 成功したら3秒後にログインページへリダイレクト
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      setMessage({
        type: 'error',
        text: apiError.response?.data?.message || 'エラーが発生しました。しばらく経ってからもう一度お試しください'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">パスワード再設定</h1>

      <p className="auth-description">
        新しいパスワードを入力してください。
      </p>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
          {message.type === 'success' && (
            <p className="redirect-notice">
              3秒後にログイン画面に移動します...
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="password">新しいパスワード</label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上"
            disabled={isSubmitting || !token}
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirmation">パスワード（確認用）</label>
          <input
            className="form-input"
            type="password"
            id="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="同じパスワードを入力"
            disabled={isSubmitting || !token}
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !token}
        >
          {isSubmitting ? '送信中...' : 'パスワードを更新する'}
        </button>

        <div className="auth-links">
          <a href="/login" className="auth-link">
            ログイン画面に戻る
          </a>
        </div>
      </form>
    </div>
  );
}
