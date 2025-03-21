'use client';

import { useState } from 'react';

// ステップ2のプロパティ
interface RegisterStep2Props {
  nickname: string;
  password: string;
  updateFormData: (data: { nickname?: string; password?: string }) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// アカウント情報入力ステップ
const RegisterStep2 = ({
  nickname,
  password,
  updateFormData,
  nextStep,
  prevStep
}: RegisterStep2Props) => {
  // バリデーションエラー
  const [errors, setErrors] = useState({
    nickname: '',
    password: ''
  });

  // ニックネームの変更ハンドラ
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ nickname: e.target.value });
    setErrors(prev => ({ ...prev, nickname: '' }));
  };

  // パスワードの変更ハンドラ
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ password: e.target.value });
    setErrors(prev => ({ ...prev, password: '' }));
  };

  // フォーム送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const newErrors = {
      nickname: '',
      password: ''
    };

    if (!nickname) {
      newErrors.nickname = 'ニックネームを入力してください';
    } else if (nickname.length > 20) {
      newErrors.nickname = 'ニックネームは20文字以内で入力してください';
    }

    if (!password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }

    // エラーがあれば表示
    if (newErrors.nickname || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    // 次のステップへ
    nextStep();
  };

  return (
    <div>
      <h2 className="auth-title">会員登録</h2>
      <div className="step-title">アカウント情報を入力してください</div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nickname" className="form-label">ニックネーム</label>
          <input
            id="nickname"
            type="text"
            className="form-input"
            placeholder="ニックネーム"
            value={nickname}
            onChange={handleNicknameChange}
          />
          {errors.nickname && <div className="form-error">{errors.nickname}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">パスワード</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={handlePasswordChange}
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            className="auth-button"
            style={{ flex: 1, backgroundColor: '#aaaaaa' }}
            onClick={prevStep}
          >
            戻る
          </button>
          <button
            type="submit"
            className="auth-button"
            style={{ flex: 1 }}
          >
            次へ
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterStep2;
