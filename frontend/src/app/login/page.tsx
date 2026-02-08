import { Suspense } from 'react';
import LoginClient from '@/components/auth/LoginClient';

// ログインページ
export default function LoginPage() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>読み込み中...</div>}>
        <LoginClient />
      </Suspense>
    </div>
  );
}
