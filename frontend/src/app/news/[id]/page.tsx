'use client';

import Image from 'next/image';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';
import '@styles/common.css';
import '@styles/ContentDetail.css';
import { useParams } from 'next/navigation';
import NewsDetailContainer from './news-detail.container';

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;

  return (
    <div className="container">
      <header className="header">
        <h1>
          <Image className="logo" src={'/logo.png'} width={190} height={45} alt="logo" />
        </h1>
        <HamburgerMenu />
      </header>

      {/* ニュース詳細 */}
      <NewsDetailContainer newsId={newsId} />

      <Footer />
    </div>
  );
}
