import EventList from '../../components/EventList';
import EventCategoryList from '../../components/EventCategoryList';

export const metadata = {
  title: 'イベント一覧 | 福岡遊び日記',
  description: '福岡市内で開催される様々なイベント情報を掲載しています。フェス、マーケット、展示会、ワークショップなど、ジャンル別に探せます。',
};

export default function EventsPage() {
  return (
    <div className="events-page-container">
      <h1 className="events-page-heading">福岡のイベント</h1>

      {/* イベントカテゴリ一覧 */}
      <section className="events-category-section">
        <EventCategoryList />
      </section>

      {/* 今後のイベント */}
      <section className="events-upcoming-section">
        <h2 className="events-section-heading">今後のイベント</h2>
        <EventList upcoming={true} limit={8} showAll={false} />
      </section>

      {/* 注目のイベント */}
      <section className="events-featured-section">
        <h2 className="events-section-heading">注目のイベント</h2>
        <div className="events-featured-info">
          <p className="events-featured-text">
            福岡市内外で開催される様々なイベント情報を掲載しています。
            お気に入りのイベントを見つけて、福岡での時間をもっと楽しみましょう！
          </p>
        </div>
        <EventList limit={4} showAll={false} />
      </section>

      {/* オンラインイベント */}
      <section className="events-online-section">
        <h2 className="events-section-heading">オンラインイベント</h2>
        <p className="events-online-description">
          自宅からでも参加できるオンラインイベントをチェックしましょう。
        </p>
        <EventList limit={4} showAll={false} />
      </section>
    </div>
  );
}
