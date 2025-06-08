import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/components/ApolloWrapper";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "福岡遊び - 管理画面",
  description: "福岡遊びサービスの管理画面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#FAFAFA]`}>
        <ApolloWrapper>
          <div className="admin-layout">
            <aside className="admin-sidebar">
              <div className="admin-sidebar-header">
                <h1 className="admin-sidebar-title">福岡遊び管理</h1>
              </div>
              <nav className="admin-sidebar-nav">
                <ul className="admin-sidebar-nav-list">
                  <li className="admin-sidebar-nav-item">
                    <Link href="/" className="admin-sidebar-nav-link">ダッシュボード</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="spots" className="admin-sidebar-nav-link">スポット</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="areas" className="admin-sidebar-nav-link">エリア</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="categories" className="admin-sidebar-nav-link">カテゴリー</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="districts" className="admin-sidebar-nav-link">地区</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="hashtags" className="admin-sidebar-nav-link">ハッシュタグ</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="menus" className="admin-sidebar-nav-link">メニュー</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="purposes" className="admin-sidebar-nav-link">目的</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="recommended_fors" className="admin-sidebar-nav-link">おすすめ対象</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="spot_ambiances" className="admin-sidebar-nav-link">雰囲気</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="play_plans" className="admin-sidebar-nav-link">遊びプラン</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="events" className="admin-sidebar-nav-link">イベント</Link>
                  </li>
                  <li className="admin-sidebar-nav-item">
                    <Link href="news" className="admin-sidebar-nav-link">ニュース</Link>
                  </li>
                </ul>
              </nav>
            </aside>
            <main className="admin-main">
              {children}
            </main>
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
