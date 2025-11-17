'use client';

import { useEffect } from 'react';
import '@styles/Auth.css';

// 会員登録フローの親コンポーネント
const RegisterFlow = () => {
  useEffect(() => {
    // Redirect to login page after showing message
    const timer = setTimeout(() => {
      window.location.href = '/login';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="auth-container">
      <h2 className="auth-title">会員登録</h2>

      <div className="auth-info" style={{ 
        marginTop: '2rem', 
        padding: '2rem', 
        backgroundColor: '#fef3c7', 
        borderRadius: '8px', 
        border: '2px solid #fbbf24',
        textAlign: 'center'
      }}>
        <h3 style={{ marginTop: 0, color: '#92400e' }}>パスワードによる登録は廃止されました</h3>
        <p style={{ margin: '1rem 0', fontSize: '1rem', color: '#78350f' }}>
          現在はGoogleアカウントでのログインのみご利用いただけます。
        </p>
        <p style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#78350f' }}>
          3秒後にログインページへ移動します...
        </p>
        <a href="/login" style={{ 
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}>
          ログインページへ
        </a>
      </div>
    </div>
  );
};

export default RegisterFlow;
