/**
 * パスワードリセット実行ページ
 */
import '@styles/Auth.css';
import { Suspense } from 'react';
import ResetPassword from '@/components/auth/ResetPassword';

export const metadata = {
  title: 'パスワード再設定 | 福岡遊び',
  description: '新しいパスワードを設定してください。',
};

export default function ResetPasswordPage() {
  return (
    <div className="container">
      <div className="auth-page">
        <Suspense fallback={<div className="loading">読み込み中...</div>}>
          <ResetPassword />
        </Suspense>
      </div>
    </div>
  );
}
