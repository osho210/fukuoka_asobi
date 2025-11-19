'use client';

import { useState, useEffect, useCallback } from 'react';
import '@styles/Auth.css';

// ログイン画面コンポーネント
const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Googleログイン処理
  const handleGoogleLogin = useCallback(async (credentialResponse: any) => {
    setError('');
    setIsLoading(true);

    try {
      const idToken = credentialResponse.credential;

      // GraphQL mutation to authenticate with Google
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UserGoogleAuth($idToken: String!, $termsAgreed: Boolean) {
              userGoogleAuth(idToken: $idToken, termsAgreed: $termsAgreed) {
                user {
                  id
                  email
                  username
                }
                token
                isNewUser
                errors
              }
            }
          `,
          variables: {
            idToken: idToken,
            termsAgreed: true
          }
        }),
        credentials: 'include',
      });

      const result = await response.json();

      if (result.data?.userGoogleAuth?.token) {
        // Store token
        localStorage.setItem('token', result.data.userGoogleAuth.token);
        // Redirect to home
        window.location.href = '/';
      } else if (result.data?.userGoogleAuth?.isNewUser && result.data?.userGoogleAuth?.errors?.includes('新規ユーザーの場合は利用規約への同意が必要です')) {
        // Need terms agreement
        setError('利用規約への同意が必要です');
      } else {
        const errors = result.data?.userGoogleAuth?.errors || ['認証に失敗しました'];
        setError(errors.join(', '));
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('ログイン中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load Google OAuth script and initialize
    const loadGoogleScript = () => {
      // Check if already loaded
      if ((window as any).google?.accounts?.id) {
        setIsGoogleLoaded(true);
        return;
      }

      // Check if script is already in DOM
      if (document.getElementById('google-oauth-script')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-oauth-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsGoogleLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google OAuth script');
        setError('Google認証の読み込みに失敗しました');
      };

      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  useEffect(() => {
    // Initialize Google Sign-In button after script loads
    if (!isGoogleLoaded || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      return;
    }

    try {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      const buttonElement = document.getElementById('google-signin-button');
      if (buttonElement) {
        (window as any).google.accounts.id.renderButton(
          buttonElement,
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: '100%',
            locale: 'ja',
          }
        );
      }
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
      setError('Google認証の初期化に失敗しました');
    }
  }, [isGoogleLoaded, handleGoogleLogin]);

  return (
    <div className="auth-container">
      <h2 className="auth-title">ログイン・新規登録</h2>

      <div className="auth-info" style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#0c4a6e' }}>
          Googleアカウントでログイン・新規登録ができます。<br />
          初めての方も既存ユーザーの方も、同じボタンからログインしてください。
        </p>
      </div>

      {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p>ログイン中...</p>
        </div>
      )}

      <div className="social-buttons">
        {!isGoogleLoaded && !error && (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
            <p>Google認証を読み込み中...</p>
          </div>
        )}
        <div id="google-signin-button" style={{ width: '100%' }}></div>
      </div>

      {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#991b1b' }}>
            Google Client IDが設定されていません。環境変数を確認してください。
          </p>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
        <p>
          ログインすることで、<a href="/privacy-policy" style={{ color: '#3b82f6', textDecoration: 'underline' }}>プライバシーポリシー</a>と
          <a href="/privacy-policy" style={{ color: '#3b82f6', textDecoration: 'underline' }}>利用規約</a>に同意したものとみなします。
        </p>
      </div>
    </div>
  );
};

export default Login;
