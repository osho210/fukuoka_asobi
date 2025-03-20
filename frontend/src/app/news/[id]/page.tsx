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
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>記事が見つかりませんでした。</p>
                    <Link href="/news" className="text-blue-600 hover:underline mt-2 inline-block">
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
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <Link href="/news" className="text-blue-600 hover:underline">
                    ← ニュース一覧に戻る
                </Link>
            </div>

            <article className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64 w-full">
                    {news.imageUrl ? (
                        <Image
                            src={`/${news.imageUrl}`}
                            alt={news.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                    {news.category && (
                        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded">
                            {news.category.name}
                        </span>
                    )}
                </div>

                <div className="p-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{news.title}</h1>

                    <div className="flex items-center text-gray-500 mb-6">
                        <time dateTime={news.publishedAt}>{formattedDate}</time>
                        {news.author && (
                            <span className="ml-4">投稿者: {news.author.username}</span>
                        )}
                    </div>

                    <div className="prose max-w-none">
                        {formattedBody}
                    </div>
                </div>
            </article>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">関連ニュース</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.values(newsData)
                        .filter(item => item.id !== id)
                        .slice(0, 3)
                        .map(item => (
                            <Link key={item.id} href={`/news/${item.id}`} className="block">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative h-40 w-full">
                                        {item.imageUrl ? (
                                            <Image
                                                src={`/${item.imageUrl}`}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold mb-2 line-clamp-2">{item.title}</h3>
                                        <time className="text-sm text-gray-500" dateTime={item.publishedAt}>
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
