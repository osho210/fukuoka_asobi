/**
 * パスワードリセットリクエストページ
 */
import '@styles/Auth.css';
import ForgotPassword from '@/components/auth/ForgotPassword';

export const metadata = {
    title: 'パスワードをお忘れの方 | 福岡遊び日記',
    description: 'パスワードをお忘れの方はこちらからパスワードリセットのリクエストを行ってください。',
};

export default function ForgotPasswordPage() {
    return (
        <div className="container">
            <div className="auth-page">
                <ForgotPassword />
            </div>
        </div>
    );
}
