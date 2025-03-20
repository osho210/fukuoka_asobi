'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// 仮のニュースデータ
const newsData = [
    {
        id: '1',
        title: '福岡の新しい観光スポット「福岡タワーパーク」がオープン',
        publishedAt: new Date().toISOString(),
        imageUrl: 'itoshima.png',
        category: { name: 'イベント' }
    },
    {
        id: '2',
        title: '福岡グルメフェスティバル2025の開催が決定',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'itoshima.png',
        category: { name: 'グルメ' }
    },
    {
        id: '3',
        title: '福岡市内の公園でナイトピクニックイベントを開催',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: 'itoshima.png',
        category: { name: 'イベント' }
    }
];

export default function RecommendedNews() {
    return (
        <div className="recommended-news">
            <div className="news-grid">
                {newsData.map((news) => (
                    <Link key={news.id} href={`/news/${news.id}`} className="news-card">
                        <div className="news-image-container">

                            <Image
                                src={news.imageUrl.startsWith('http') ? news.imageUrl : `/${news.imageUrl}`}
                                alt={news.title}
                                width={400}
                                height={300}
                                className="news-image"
                            />
                            {news.category && (
                                <span className="news-category">{news.category.name}</span>
                            )}
                        </div>
                        <div className="news-content">
                            <h3 className="news-title">{news.title}</h3>
                            <time className="news-date">
                                {format(new Date(news.publishedAt), 'yyyy年MM月dd日', { locale: ja })}
                            </time>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
