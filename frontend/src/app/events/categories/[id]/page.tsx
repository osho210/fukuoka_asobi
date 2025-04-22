import Link from 'next/link';
import EventList from '@/components/EventList';
import EventCategoryList from '@/components/EventCategoryList';

type CategoryPageProps = {
  params: Promise<{ id: string }>
};

export const metadata = {
  title: 'カテゴリ別イベント | 福岡遊び日記',
  description: '福岡市内で開催されるイベントをカテゴリ別に探せます。フェス、マーケット、展示会、ワークショップなど、様々なジャンルのイベントを掲載しています。',
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

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
    <div className="event-category-page-container">
      <div className="event-category-back-link-container">
        <Link href="/events" className="event-category-back-link">
          ← イベント一覧に戻る
        </Link>
      </div>

      <h1 className="event-category-page-heading">{categoryName}のイベント</h1>

      <div className="event-category-page-layout">
        {/* サイドバー */}
        <div className="event-category-sidebar">
          <div className="event-category-sidebar-box">
            <h2 className="event-category-sidebar-heading">カテゴリから探す</h2>
            <EventCategoryList />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="event-category-main-content">
          {/* 今後のイベント */}
          <section className="event-category-upcoming-section">
            <h2 className="event-category-section-heading">今後の{categoryName}イベント</h2>
            <EventList categoryId={id} upcoming={true} limit={8} showAll={true} />
          </section>

          {/* 過去のイベント */}
          <section className="event-category-past-section">
            <h2 className="event-category-section-heading">過去の{categoryName}イベント</h2>
            <EventList categoryId={id} upcoming={false} limit={4} showAll={false} />
          </section>
        </div>
      </div>
    </div>
  );
}
