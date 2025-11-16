'use client';

import { useQuery } from '@apollo/client';
import { GET_NEWS_LIST } from '@/graphql/queries/getNewsList';
import { News } from '@/__generated__/graphql';
import NewsDetailAdapter from '@/components/adapters/NewsDetailAdapter';

interface NewsDetailContainerProps {
  newsId: string;
}

interface NewsData {
  news: News[];
}

export default function NewsDetailContainer({ newsId }: NewsDetailContainerProps) {
  const { loading, error, data } = useQuery<NewsData>(GET_NEWS_LIST, {
    variables: { id: newsId },
  });

  if (loading) return <div className="content-detail-loading">読み込み中...</div>;
  if (error) return <div className="content-detail-error">エラーが発生しました: {error.message}</div>;
  if (!data || !data.news || data.news.length === 0) return <div className="content-detail-not-found">ニュースが見つかりません</div>;

  // バックエンドから返されるステータスの文字列をNewsStatus型に変換
  const newsWithCorrectStatus: News = {
    ...data.news[0],
    status: data.news[0].status as unknown as NewsStatus
  };

  return <NewsDetailAdapter news={newsWithCorrectStatus} />;
}
