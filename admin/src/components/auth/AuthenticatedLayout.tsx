'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider } from '@/components/auth/AuthProvider';
import LogoutButton from '@/components/auth/LogoutButton';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ログインページの場合はサイドバーを表示しない
  if (pathname === '/login') {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h1 className="admin-sidebar-title">福岡遊び管理</h1>
            <LogoutButton />
          </div>
          <nav className="admin-sidebar-nav">
            <ul className="admin-sidebar-nav-list">
              <li className="admin-sidebar-nav-item">
                <Link href="/" className="admin-sidebar-nav-link">ダッシュボード</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/spots" className="admin-sidebar-nav-link">スポット</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/areas" className="admin-sidebar-nav-link">エリア</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/categories" className="admin-sidebar-nav-link">カテゴリー</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/districts" className="admin-sidebar-nav-link">地区</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/hashtags" className="admin-sidebar-nav-link">ハッシュタグ</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/menus" className="admin-sidebar-nav-link">メニュー</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/purposes" className="admin-sidebar-nav-link">目的</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/recommended_fors" className="admin-sidebar-nav-link">おすすめ対象</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/spot_ambiances" className="admin-sidebar-nav-link">雰囲気</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/play_plans" className="admin-sidebar-nav-link">遊びプラン</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/events" className="admin-sidebar-nav-link">イベント</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/news" className="admin-sidebar-nav-link">ニュース</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/stations" className="admin-sidebar-nav-link">駅マスタ</Link>
              </li>
              <li className="admin-sidebar-nav-item">
                <Link href="/magazines" className="admin-sidebar-nav-link">雑誌マスタ</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="admin-main">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
