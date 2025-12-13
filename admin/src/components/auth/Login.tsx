'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import '@styles/Auth.css';

type CredentialResponse = {
  credential: string;
  select_by?: string;
};

// 管理画面ログインコンポーネント
const Login = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Googleログイン処理
  const handleGoogleLogin = useCallback(async (credentialResponse: CredentialResponse) => {
    setError('');
    setIsLoading(true);

    try {
      const idToken = credentialResponse.credential;

      // GraphQLエンドポイントにリクエスト
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UserGoogleAuth($input: UserGoogleAuthInput!) {
              userGoogleAuth(input: $input) {
                user {
                  id
                  email
                  username
                  role
                }
                token
                isNewUser
                errors
              }
            }
          `,
          variables: {
            input: {
              idToken: idToken,
              termsAgreed: true,
            },
          },
        }),
        credentials: 'include',
      });

      const googleLoginResult = await response.json();

      if (googleLoginResult.errors?.length) {
        setError(googleLoginResult.errors.map((e: { message: string }) => e.message).join(', '));
        setIsLoading(false);
        return;
      }

      const payload = googleLoginResult.data?.userGoogleAuth;

      // ログインに成功した場合、権限チェック
      if (payload?.user) {
        // admin権限チェック
        if (payload.user.role !== 'admin') {
          setError('管理者権限が必要です。一般ユーザーはアクセスできません。');
          setIsLoading(false);
          return;
        }

        // 管理画面のダッシュボードにリダイレクト
        router.push('/');
        return;
      }

      const errors = payload?.errors || ['認証に失敗しました'];
      setError(errors.join(', '));
      setIsLoading(false);
    } catch (error) {
      console.error('Google login error:', error);
      setError('ログイン中にエラーが発生しました。もう一度お試しください。');
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Google OAuth scriptの読み込み
    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true);
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
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setError('Google認証の設定が見つかりません。管理者に連絡してください。');
      return;
    }
    if (!isGoogleLoaded) {
      return;
    }

    try {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      const buttonElement = document.getElementById('google-signin-button');
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: '100%',
          locale: 'ja',
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to initialize Google Sign-In:', error);
      }
      setError('Google認証の初期化に失敗しました');
    }
  }, [isGoogleLoaded, handleGoogleLogin]);

  return (
    <div className="auth-container">
      <h2 className="auth-title">管理画面ログイン</h2>
      <p className="auth-description">
        管理者権限を持つGoogleアカウントでログインしてください
      </p>

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

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
        <p>
          このページは管理者専用です。<br />
          一般ユーザーの方は<a href={process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:8200'} style={{ color: '#3b82f6', textDecoration: 'underline' }}>こちら</a>からアクセスしてください。
        </p>
      </div>
    </div>
  );
};

export default Login;
