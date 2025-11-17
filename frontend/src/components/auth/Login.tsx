'use client';

import { useState, useEffect } from 'react';
import '@styles/Auth.css';

// Google OAuth script loading utility
const loadGoogleScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById('google-oauth-script')) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'google-oauth-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google OAuth script'));
    document.head.appendChild(script);
  });
};

// ログイン画面コンポーネント
const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Google OAuth script
    loadGoogleScript().catch((err) => {
      console.error('Failed to load Google OAuth:', err);
      setError('Google認証の読み込みに失敗しました');
    });
  }, []);

  // Googleログイン
  const handleGoogleLogin = async (credentialResponse: any) => {
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
        // Need terms agreement - could show a modal here
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
  };

  useEffect(() => {
    // Initialize Google Sign-In button
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: '100%',
        }
      );
    }
  }, []);

  return (
    <div className="auth-container">
      <h2 className="auth-title">ログイン</h2>

      <div className="auth-info" style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#0c4a6e' }}>
          Googleアカウントでログインしてください。<br />
          パスワード認証は廃止されました。
        </p>
      </div>

      {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p>ログイン中...</p>
        </div>
      )}

      <div className="social-buttons">
        <div id="google-signin-button" style={{ width: '100%' }}></div>
      </div>

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
