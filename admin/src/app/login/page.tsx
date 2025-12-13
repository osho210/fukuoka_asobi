import Login from '@/components/auth/Login';

export default function LoginPage() {
  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Login />
    </div>
  );
}
