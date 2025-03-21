'use client';

import { useState } from 'react';
import '../../../public/styles/Auth.css';

// ログイン画面コンポーネント
const Login = () => {
  // フォームデータ
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // バリデーションエラー
  const [error, setError] = useState('');

  // 入力値の変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // エラーをクリア
  };

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!formData.email || !formData.password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
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
        setError('メールアドレスまたはパスワードが正しくありません');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('ログイン中にエラーが発生しました。もう一度お試しください。');
    }
  };

  // Googleログイン
  const handleGoogleLogin = () => {
    // Googleログイン処理
    console.log('Google login');
  };

  // Appleログイン
  const handleAppleLogin = () => {
    // Appleログイン処理
    console.log('Apple login');
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">ログイン</h2>

      <div className="social-buttons">
        <button
          type="button"
          className="social-button"
          onClick={handleGoogleLogin}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ marginRight: '8px', fontWeight: 'bold' }}>G</span>
          Googleでログイン
        </button>
        <button
          type="button"
          className="social-button"
          onClick={handleAppleLogin}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ marginRight: '8px', fontWeight: 'bold' }}>A</span>
          Appleでログイン
        </button>
      </div>

      <div className="divider">または</div>

      <form className="auth-form" onSubmit={handleLogin}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="メールアドレス"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="パスワード"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <a href="/forgot-password" className="auth-link" style={{ textAlign: 'right', marginTop: '0.5rem' }}>
          パスワードをお忘れの方
        </a>

        <button type="submit" className="auth-button">
          ログイン
        </button>
      </form>

      <a href="/register" className="auth-link" style={{ marginTop: '1.5rem' }}>
        会員登録はこちら
      </a>
    </div>
  );
};

export default Login;
