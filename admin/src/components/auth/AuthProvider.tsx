'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '@/graphql/queries/getCurrentUser';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface CurrentUserData {
  currentUser: User | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const { data, loading, error } = useQuery<CurrentUserData>(GET_CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // ログインページは認証チェックをスキップ
    if (pathname === '/login') {
      setIsChecking(false);
      return;
    }

    if (loading) {
      return;
    }

    // 認証エラーまたはユーザーが存在しない場合
    if (error || !data?.currentUser) {
      router.push('/login');
      return;
    }

    // admin権限チェック
    if (data.currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    setIsChecking(false);
  }, [data, loading, error, pathname, router]);

  // ログインページの場合は認証チェックをスキップ
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // 認証チェック中はローディング表示
  if (isChecking || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        認証を確認中...
      </div>
    );
  }

  return <>{children}</>;
}
