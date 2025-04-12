/**
 * パスワードリセットリクエストフォーム
 */
'use client';

import { useState, FormEvent } from 'react';
import { requestPasswordReset } from '../../lib/api/passwordApi';

/**
 * パスワードリセットリクエストフォームコンポーネント
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /**
   * フォーム送信ハンドラー
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'メールアドレスを入力してください' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await requestPasswordReset(email);
      setMessage({
        type: 'success',
        text: response.message || 'パスワード再設定用のメールを送信しました。メールに記載されたリンクからパスワードを再設定してください'
      });
      setEmail('');
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
      <h1 className="auth-title">パスワードをお忘れの方</h1>

      <p className="auth-description">
        登録済みのメールアドレスを入力してください。<br />
        パスワード再設定用のリンクをメールでお送りします。
      </p>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            className='form-input'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="登録済みのメールアドレス"
            disabled={isSubmitting}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : 'パスワード再設定メールを送信'}
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
