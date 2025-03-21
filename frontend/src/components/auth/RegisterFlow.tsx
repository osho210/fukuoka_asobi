'use client';

import { useState } from 'react';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import RegisterStep3 from './RegisterStep3';
import '../../../public/styles/Auth.css';

// 会員登録フローの親コンポーネント
const RegisterFlow = () => {
  // 現在のステップ
  const [currentStep, setCurrentStep] = useState(1);

  // フォームデータ
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    gender: 'prefer_not_to_say',
    termsAgreed: false
  });

  // フォームデータの更新
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // 次のステップへ進む
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  // 前のステップへ戻る
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // 会員登録の実行
  const handleRegister = async () => {
    try {
      const response = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: formData.email,
            username: formData.nickname,
            password: formData.password,
            gender: formData.gender,
            terms_agreed: formData.termsAgreed
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // ログイン成功時の処理（トークンの保存など）
        localStorage.setItem('token', data.token);
        // ホーム画面などへリダイレクト
        window.location.href = '/';
      } else {
        // エラー処理
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        alert('登録に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('登録中にエラーが発生しました。もう一度お試しください。');
    }
  };

  // ステップに応じたコンポーネントを表示
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegisterStep1
            email={formData.email}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <RegisterStep2
            nickname={formData.nickname}
            password={formData.password}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <RegisterStep3
            gender={formData.gender}
            termsAgreed={formData.termsAgreed}
            updateFormData={updateFormData}
            handleRegister={handleRegister}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}></div>
      </div>
      {renderStep()}
    </div>
  );
};

export default RegisterFlow;
