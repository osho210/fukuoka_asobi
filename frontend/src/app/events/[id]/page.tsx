import EventList from '@/components/EventList';
import '@styles/EventsPage.css';
import '@styles/ContentDetail.css';
import EventDetailContainer from './event-detail.container';

type EventPageProps = {
  params: Promise<{ id: string }>
};

export const metadata = {
  title: 'イベント詳細 | 福岡遊び日記',
  description: '福岡市内で開催されるイベントの詳細情報です。開催日時、場所、料金などの情報を確認できます。',
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  return (
    <>
      {/* イベント詳細 */}
      <EventDetailContainer eventId={id} />

      {/* 関連イベント */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">開催中のイベント</h2>
        <EventList limit={4} showAll={false} />
      </section>
    </>
  );
}
