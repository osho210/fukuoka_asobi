import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApolloWrapper from '@/components/ApolloWrapper';
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import '@styles/common.css';
import '@styles/PlayPlanList.css';
import '@styles/RecommendedSpot.css';
import '@styles/RecommendedEvent.css';
import '@styles/RecommendedNews.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "福岡遊び日記",
  description: "福岡の遊び場所を探すアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ApolloWrapper>
          <div className="container">
            <Header />
            {children}
            <Footer />
          </div >
        </ApolloWrapper>
      </body>
    </html>
  );
}
