import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';

// GraphQLの型定義が生成されるまでの仮の型定義
type Category = {
    id: string;
    name: string;
};

type Author = {
    id: string;
    username: string;
    profileImageUrl?: string | null;
};

type NewsItem = {
    id: string;
    title: string;
    body: string;
    publishedAt: string;
    status: string;
    imageUrl?: string | null;
    category?: Category | null;
    author?: Author | null;
    createdAt: string;
    updatedAt: string;
};

// 仮のデータ
const newsData: { [key: string]: NewsItem } = {
    '1': {
        id: '1',
        title: '福岡の新しい観光スポット「福岡タワーパーク」がオープン',
        body: `福岡市中央区に新しい観光スポット「福岡タワーパーク」がオープンしました。広大な敷地内には、遊具やカフェ、イベントスペースなどが設置され、家族連れやカップルに人気のスポットとなっています。

週末にはさまざまなイベントも開催される予定で、地元の方だけでなく観光客にも楽しんでいただける場所となっています。入場料は大人500円、子供300円で、年間パスポートも販売されています。

営業時間は9:00から18:00まで（季節により変動あり）。詳細は公式サイトをご確認ください。`,
        publishedAt: new Date().toISOString(),
        status: 'published',
        imageUrl: 'itoshima.png',
        category: { id: '1', name: 'イベント' },
        author: { id: '1', username: '管理者' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    '2': {
        id: '2',
        title: '福岡グルメフェスティバル2025の開催が決定',
        body: `福岡の食文化を楽しめる「福岡グルメフェスティバル2025」の開催が決定しました。来年5月に福岡市博多区の福岡国際センターで3日間にわたり開催されます。

福岡の名物料理はもちろん、九州各地の美味しいグルメが一堂に会するイベントで、昨年は3日間で約5万人が来場しました。今年はさらに規模を拡大し、海外からの出店も予定されています。

入場料は前売り券800円、当日券1,000円。前売り券は来月から販売開始予定です。詳細は公式サイトで随時更新されます。`,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        imageUrl: 'itoshima.png',
        category: { id: '2', name: 'グルメ' },
        author: { id: '2', username: '編集部' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    '3': {
        id: '3',
        title: '福岡市内の公園でナイトピクニックイベントを開催',
        body: `福岡市内の主要公園で、夜の公園を楽しむ「ナイトピクニック」イベントが今月末から開催されます。大濠公園、舞鶴公園など市内5カ所の公園で順次開催され、ライトアップされた公園でピクニックを楽しむことができます。

各会場ではフードトラックの出店や、アコースティックライブなども予定されており、新しい公園の楽しみ方を提案しています。参加は無料ですが、一部エリアは事前予約制となっています。

詳細なスケジュールや予約方法は、福岡市公式サイトでご確認ください。`,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        imageUrl: 'itoshima.png',
        category: { id: '1', name: 'イベント' },
        author: { id: '1', username: '管理者' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
};



type PageProps = {
    params: Promise<{ id: string }>
};

export default async function NewsDetailPage(props: PageProps) {
    const { id } = await props.params;

    // 仮のデータから記事を取得
    const news = newsData[id];

    // 記事が見つからない場合
    if (!news) {
        return (
            <div className="news-detail-container">
                <div className="news-not-found-alert">
                    <p>記事が見つかりませんでした。</p>
                    <Link href="/news" className="news-back-link">
                        ニュース一覧に戻る
                    </Link>
                </div>
            </div>
        );
    }

    // 日付のフォーマット
    const formattedDate = news.publishedAt
        ? format(new Date(news.publishedAt), 'yyyy年MM月dd日', { locale: ja })
        : '';

    // 本文の改行を反映
    const formattedBody = news.body.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mb-4">{paragraph}</p>
    ));

    return (
        <div className="news-detail-container">
            <div className="news-detail-back-link-container">
                <Link href="/news" className="news-back-link">
                    ← ニュース一覧に戻る
                </Link>
            </div>

            <article className="news-detail-article">
                <div className="news-detail-image-container">
                    {news.imageUrl ? (
                        <Image
                            src={`/${news.imageUrl}`}
                            alt={news.title}
                            fill
                            className="news-detail-image"
                        />
                    ) : (
                        <div className="news-detail-no-image">
                            <span className="news-detail-no-image-text">No Image</span>
                        </div>
                    )}
                    {news.category && (
                        <span className="news-detail-category">
                            {news.category.name}
                        </span>
                    )}
                </div>

                <div className="news-detail-content">
                    <h1 className="news-detail-title">{news.title}</h1>

                    <div className="news-detail-meta">
                        <time dateTime={news.publishedAt}>{formattedDate}</time>
                        {news.author && (
                            <span className="ml-4">投稿者: {news.author.username}</span>
                        )}
                    </div>

                    <div className="news-detail-body">
                        {formattedBody}
                    </div>
                </div>
            </article>

            <div className="news-related-section">
                <h2 className="news-related-heading">関連ニュース</h2>
                <div className="news-related-grid">
                    {Object.values(newsData)
                        .filter(item => item.id !== id)
                        .slice(0, 3)
                        .map(item => (
                            <Link key={item.id} href={`/news/${item.id}`} className="news-related-link">
                                <div className="news-related-card">
                                    <div className="news-related-image-container">
                                        {item.imageUrl ? (
                                            <Image
                                                src={`/${item.imageUrl}`}
                                                alt={item.title}
                                                fill
                                                className="news-related-image"
                                            />
                                        ) : (
                                            <div className="news-related-no-image">
                                                <span className="news-related-no-image-text">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="news-related-card-content">
                                        <h3 className="news-related-card-title">{item.title}</h3>
                                        <time className="news-related-card-date" dateTime={item.publishedAt}>
                                            {format(new Date(item.publishedAt), 'yyyy年MM月dd日', { locale: ja })}
                                        </time>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
}
