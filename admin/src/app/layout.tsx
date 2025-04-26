import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/components/ApolloWrapper";

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
          <div className="flex min-h-screen">
            <aside className="w-64 bg-white border-r border-gray-200 p-4">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-primary">福岡遊び管理</h1>
              </div>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <a href="/admin" className="block p-2 rounded hover:bg-gray-100">ダッシュボード</a>
                  </li>
                  <li>
                    <a href="/admin/spots" className="block p-2 rounded hover:bg-gray-100">スポット</a>
                  </li>
                  <li>
                    <a href="/admin/areas" className="block p-2 rounded hover:bg-gray-100">エリア</a>
                  </li>
                  <li>
                    <a href="/admin/categories" className="block p-2 rounded hover:bg-gray-100">カテゴリー</a>
                  </li>
                  <li>
                    <a href="/admin/districts" className="block p-2 rounded hover:bg-gray-100">地区</a>
                  </li>
                  <li>
                    <a href="/admin/hashtags" className="block p-2 rounded hover:bg-gray-100">ハッシュタグ</a>
                  </li>
                  <li>
                    <a href="/admin/menus" className="block p-2 rounded hover:bg-gray-100">メニュー</a>
                  </li>
                  <li>
                    <a href="/admin/purposes" className="block p-2 rounded hover:bg-gray-100">目的</a>
                  </li>
                  <li>
                    <a href="/admin/recommended_fors" className="block p-2 rounded hover:bg-gray-100">おすすめ対象</a>
                  </li>
                  <li>
                    <a href="/admin/spot_ambiances" className="block p-2 rounded hover:bg-gray-100">雰囲気</a>
                  </li>
                  <li>
                    <a href="/admin/play_plans" className="block p-2 rounded hover:bg-gray-100">遊びプラン</a>
                  </li>
                  <li>
                    <a href="/admin/events" className="block p-2 rounded hover:bg-gray-100">イベント</a>
                  </li>
                  <li>
                    <a href="/admin/news" className="block p-2 rounded hover:bg-gray-100">ニュース</a>
                  </li>
                </ul>
              </nav>
            </aside>
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
