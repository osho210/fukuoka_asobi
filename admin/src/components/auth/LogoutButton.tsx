'use client';

import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { USER_LOGOUT } from '@/graphql/mutations/userLogout';
import { useState } from 'react';

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
      const { data } = await logout();

      if (data?.userLogout.success) {
        // ログアウト成功時、ログイン画面にリダイレクト
        router.push('/login');
      } else {
        const errors = data?.userLogout.errors || ['ログアウトに失敗しました'];
        alert(errors.join(', '));
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('ログアウト中にエラーが発生しました');
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isLoggingOut ? 'not-allowed' : 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        opacity: isLoggingOut ? 0.6 : 1,
      }}
    >
      {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}
