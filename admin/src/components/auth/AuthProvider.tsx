'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '@/graphql/queries/getCurrentUser';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, loading, error } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // ログインページは認証チェックをスキップ
    if (pathname === '/login') return;
    if (loading) return;

    // APIが別ドメインのため、エラー発生時のみ弾く
    if (error) {
      router.replace('/login');
      return;
    }

    // ログインユーザー が確定して存在しない場合のみ弾く
    if (data && data.currentUser === null) {
      router.replace('/login');
      return;
    }

    // 管理者チェック
    if (data?.currentUser && data.currentUser.role !== 'admin') {
      router.replace('/login');
      return;
    }
  }, [loading, data, error, pathname, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading) {
    return <div className="auth-checking">認証を確認中...</div>;
  }

  return <>{children}</>;
}
