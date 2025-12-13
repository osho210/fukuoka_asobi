'use client';

import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { USER_LOGOUT } from '@/graphql/mutations/userLogout';
import { useState } from 'react';
import '@styles/Auth.css';

interface LogoutResponse {
  userLogout: {
    success: boolean;
    errors: string[];
  };
}

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logout] = useMutation<LogoutResponse>(USER_LOGOUT);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    if (!confirm('ログアウトしますか？')) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const { data } = await logout({
        variables: {
          input: {},
        },
      });

      if (data?.userLogout.success) {
        // ログアウト成功時、ログイン画面にリダイレクト
        router.push('/login');
      } else {
        const errors = data?.userLogout.errors || ['ログアウトに失敗しました'];
        alert(errors.join(', '));
        setIsLoggingOut(false);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout error:', error);
      }
      alert('ログアウト中にエラーが発生しました');
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="logout-button"
    >
      {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}
