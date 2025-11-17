'use client';

import { useQuery } from '@apollo/client';
import { GET_NEWS_LIST } from '@/graphql/queries/getNewsList';
import { GetNewsListQuery, StatusEnum } from '@/__generated__/types';
import NewsDetailAdapter from '@/components/adapters/NewsDetailAdapter';

interface NewsDetailContainerProps {
  newsId: string;
}

export default function NewsDetailContainer({ newsId }: NewsDetailContainerProps) {
  const { loading, error, data } = useQuery<GetNewsListQuery>(GET_NEWS_LIST, {
    variables: { id: newsId },
  });

  if (loading) return <div className="content-detail-loading">読み込み中...</div>;
  if (error) return <div className="content-detail-error">エラーが発生しました: {error.message}</div>;
  if (!data || !data.news || data.news.length === 0) return <div className="content-detail-not-found">ニュースが見つかりません</div>;

  return <NewsDetailAdapter news={data.news[0]} />;
}
