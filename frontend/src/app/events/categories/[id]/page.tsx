import Link from 'next/link';
import EventList from '../../../../components/EventList';
import EventCategoryList from '../../../../components/EventCategoryList';

type CategoryPageProps = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: 'カテゴリ別イベント | 福岡遊び',
  description: '福岡市内で開催されるイベントをカテゴリ別に探せます。フェス、マーケット、展示会、ワークショップなど、様々なジャンルのイベントを掲載しています。',
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;

  // カテゴリ名を取得するための関数（実際のアプリケーションではAPIから取得）
  const getCategoryName = (categoryId: string) => {
    const categories = {
      '1': 'フェス・マーケット',
      '2': '展示会・ギャラリー',
      '3': 'ワークショップ',
      '4': 'スポーツ・アウトドア',
      '5': 'グルメ・フード',
      '6': '伝統・文化',
      '7': 'セミナー・講演会',
      '8': 'その他'
    };
    return categories[categoryId as keyof typeof categories] || 'カテゴリ不明';
  };

  const categoryName = getCategoryName(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/events" className="text-blue-500 hover:underline">
          ← イベント一覧に戻る
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">{categoryName}のイベント</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* サイドバー */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">カテゴリから探す</h2>
            <EventCategoryList />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="lg:col-span-3">
          {/* 今後のイベント */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">今後の{categoryName}イベント</h2>
            <EventList categoryId={id} upcoming={true} limit={8} showAll={true} />
          </section>

          {/* 過去のイベント */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">過去の{categoryName}イベント</h2>
            <EventList categoryId={id} upcoming={false} limit={4} showAll={false} />
          </section>
        </div>
      </div>
    </div>
  );
}

// 動的メタデータの生成
export async function generateMetadata({ params }: CategoryPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = params;

  // 実際のアプリケーションでは、ここでidを使用してカテゴリ情報を取得する
  // 例: const category = await fetchCategory(id);
  // ここではダミーデータを使用
  const getCategoryName = (categoryId: string) => {
    const categories = {
      '1': 'フェス・マーケット',
      '2': '展示会・ギャラリー',
      '3': 'ワークショップ',
      '4': 'スポーツ・アウトドア',
      '5': 'グルメ・フード',
      '6': '伝統・文化',
      '7': 'セミナー・講演会',
      '8': 'その他'
    };
    return categories[categoryId as keyof typeof categories] || 'カテゴリ不明';
  };

  const categoryName = getCategoryName(id);

  return {
    title: `${categoryName}のイベント | 福岡遊び`,
    description: `福岡市内で開催される${categoryName}のイベント情報を掲載しています。`,
  };
}
