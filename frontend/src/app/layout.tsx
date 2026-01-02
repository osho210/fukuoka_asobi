import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApolloWrapper from '@/components/ApolloWrapper';
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import '@/styles/CommonStyle.css';
import '@/styles/PlayPlanList.css';
import '@/styles/RecommendedSpot.css';
import '@/styles/RecommendedEvent.css';
import '@/styles/RecommendedNews.css';
import Script from "next/script"; // ←追加

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Adobe Fonts (Typekit) 読み込み */}
        <Script id="adobe-typekit" strategy="beforeInteractive">{`
          (function(d) {
            var config = {
              kitId: 'urf7xrq',
              scriptTimeout: 3000,
              async: true
            },
            h=d.documentElement,
            t=setTimeout(function(){
              h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";
            }, config.scriptTimeout),
            tk=d.createElement("script"),
            f=false,
            s=d.getElementsByTagName("script")[0], a;
            h.className+=" wf-loading";
            tk.src='https://use.typekit.net/'+config.kitId+'.js';
            tk.async=true;
            tk.onload=tk.onreadystatechange=function(){
              a=this.readyState;
              if(f||a&&a!="complete"&&a!="loaded") return;
              f=true;clearTimeout(t);
              try{Typekit.load(config)}catch(e){}
            };
            s.parentNode.insertBefore(tk,s)
          })(document);
        `}</Script>
        <link href="https://db.onlinewebfonts.com/c/aac28a8d3a17309e7f5bd19aadcd7915?family=Post+No+Bills+Colombo+ExtraBold" rel="stylesheet"></link>

        {/* LINE Social Plugins スクリプト - グローバルで一度だけ読み込む */}
        <Script
          src="https://www.line-website.com/social-plugins/js/thirdparty/loader.min.js"
          strategy="afterInteractive"
          async
          defer
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ApolloWrapper>
          <Header />
          <div className="container">
            {children}
            <Footer />
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}

