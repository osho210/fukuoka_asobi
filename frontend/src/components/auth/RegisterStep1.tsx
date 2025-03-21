'use client';

import { useState } from 'react';

// ステップ1のプロパティ
interface RegisterStep1Props {
  email: string;
  updateFormData: (data: { email: string }) => void;
  nextStep: () => void;
}

// メールアドレス入力ステップ
const RegisterStep1 = ({ email, updateFormData, nextStep }: RegisterStep1Props) => {
  // バリデーションエラー
  const [error, setError] = useState('');

  // メールアドレスの変更ハンドラ
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ email: e.target.value });
    setError(''); // エラーをクリア
  };

  // フォーム送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }

    // 次のステップへ
    nextStep();
  };

  return (
    <div>
      <h2 className="auth-title">会員登録</h2>
      <div className="step-title">メールアドレスを入力してください</div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder="メールアドレス"
            value={email}
            onChange={handleEmailChange}
          />
          {error && <div className="form-error">{error}</div>}
        </div>

        <button type="submit" className="auth-button">
          次へ
        </button>
      </form>

      <a href="/login" className="auth-link">
        すでにアカウントをお持ちの方はこちら
      </a>
    </div>
  );
};

export default RegisterStep1;
