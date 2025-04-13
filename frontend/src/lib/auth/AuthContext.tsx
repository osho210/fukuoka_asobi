'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// 型定義
type User = {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

// コンテキスト作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// プロバイダーコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 初期ロード時にユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/v1/login_user', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('ユーザー情報の取得中にエラーが発生しました:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ログアウト処理
  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/logout', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // ユーザー情報の再取得
  const refetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/login_user', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('ユーザー情報の再取得中にエラーが発生しました:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 認証状態の値
  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// フック
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthはAuthProviderの中で使用する必要があります');
  }
  return context;
}
