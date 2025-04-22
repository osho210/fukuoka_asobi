'use client';
import '@styles/ContentDetail.css';
import { useParams } from 'next/navigation';
import NewsDetailContainer from './news-detail.container';

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;

  return (
    <>
      {/* ニュース詳細 */}
      <NewsDetailContainer newsId={newsId} />
    </>
  );
}
