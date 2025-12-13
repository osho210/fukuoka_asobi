'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useQuery } from '@apollo/client';
import { GET_NEWS_LIST, GetNewsListQuery, GetNewsListQueryVariables } from '../graphql/queries/getNewsList';

// ニュース画像URLを取得するヘルパー関数
const getImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return '/itoshima.png';
    return imageUrl.startsWith('http') ? imageUrl : `/${imageUrl}`;
};

export default function RecommendedNews() {
    const { loading, error, data } = useQuery<GetNewsListQuery, GetNewsListQueryVariables>(GET_NEWS_LIST, {
        variables: {
            limit: 3,
        },
    });

    if (loading) return <p>読み込み中...</p>;
    if (error) return <p>エラーが発生しました: {error.message}</p>;
    if (!data || !data.news || data.news.length === 0) return <p>ニュースが見つかりません</p>;

    return (
        <div className="recommended-news">
            <div className="news-grid">
                {data.news.map((news) => (
                    <Link key={news.id} href={`/news/${news.id}`} className="news-card">
                        <div className="news-container">
                            <Image
                                src={getImageUrl(news.imageUrl)}
                                alt={news.title}
                                width={50}
                                height={50}
                                className="news-image"
                            />
                            <div className="news-content">
                                <h3 className="news-title">{news.title}</h3>
                                <div className='news-category-container'>
                                    {news.category && (
                                        <p className="news-category">{news.category.name}</p>
                                    )}
                                    {news.publishedAt && (
                                        <time className="news-date">
                                            {format(new Date(news.publishedAt), 'yyyy年MM月dd日', { locale: ja })}
                                        </time>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
