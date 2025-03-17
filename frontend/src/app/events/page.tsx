import EventList from '../../components/EventList';
import EventCategoryList from '../../components/EventCategoryList';

export const metadata = {
  title: 'イベント一覧 | 福岡遊び',
  description: '福岡市内で開催される様々なイベント情報を掲載しています。フェス、マーケット、展示会、ワークショップなど、ジャンル別に探せます。',
};

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">福岡のイベント</h1>

      {/* イベントカテゴリ一覧 */}
      <section className="mb-12">
        <EventCategoryList />
      </section>

      {/* 今後のイベント */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">今後のイベント</h2>
        <EventList upcoming={true} limit={8} showAll={false} />
      </section>

      {/* 注目のイベント */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">注目のイベント</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            福岡市内外で開催される様々なイベント情報を掲載しています。
            お気に入りのイベントを見つけて、福岡での時間をもっと楽しみましょう！
          </p>
        </div>
        <EventList limit={4} showAll={false} />
      </section>

      {/* オンラインイベント */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">オンラインイベント</h2>
        <p className="text-gray-600 mb-6">
          自宅からでも参加できるオンラインイベントをチェックしましょう。
        </p>
        <EventList limit={4} showAll={false} />
      </section>
    </div>
  );
}
