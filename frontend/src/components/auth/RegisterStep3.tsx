'use client';

import { useState } from 'react';

// ステップ3のプロパティ
interface RegisterStep3Props {
  gender: string;
  termsAgreed: boolean;
  updateFormData: (data: { gender?: string; termsAgreed?: boolean }) => void;
  handleRegister: () => void;
  prevStep: () => void;
}

// 性別選択と利用規約同意ステップ
const RegisterStep3 = ({
  gender,
  termsAgreed,
  updateFormData,
  handleRegister,
  prevStep
}: RegisterStep3Props) => {
  // バリデーションエラー
  const [error, setError] = useState('');

  // 性別の選択ハンドラ
  const handleGenderSelect = (selectedGender: string) => {
    updateFormData({ gender: selectedGender });
  };

  // 利用規約同意の変更ハンドラ
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ termsAgreed: e.target.checked });
    setError('');
  };

  // フォーム送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 利用規約に同意していない場合はエラー
    if (!termsAgreed) {
      setError('利用規約に同意してください');
      return;
    }

    // 会員登録処理を実行
    handleRegister();
  };

  return (
    <div>
      <h2 className="auth-title">会員登録</h2>
      <div className="step-title">性別を選択してください</div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="gender-options">
            <div
              className={`gender-option ${gender === 'female' ? 'selected' : ''}`}
              onClick={() => handleGenderSelect('female')}
            >
              女性
            </div>
            <div
              className={`gender-option ${gender === 'male' ? 'selected' : ''}`}
              onClick={() => handleGenderSelect('male')}
            >
              男性
            </div>
            <div
              className={`gender-option ${gender === 'prefer_not_to_say' ? 'selected' : ''}`}
              onClick={() => handleGenderSelect('prefer_not_to_say')}
            >
              回答しない
            </div>
          </div>
        </div>

        <div className="checkbox-group">
          <input
            id="terms"
            type="checkbox"
            className="checkbox-input"
            checked={termsAgreed}
            onChange={handleTermsChange}
          />
          <label htmlFor="terms" className="checkbox-label">
            <a href="/terms" target="_blank" rel="noopener noreferrer">利用規約</a>および
            <a href="/privacy" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>
            に同意します
          </label>
        </div>
        {error && <div className="form-error">{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
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
            登録する
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterStep3;
