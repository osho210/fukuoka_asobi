import EventDetail from '../../../components/EventDetail';
import EventList from '../../../components/EventList';
import Link from 'next/link';

type EventPageProps = {
  params: Promise<{ id: string }>
};

export const metadata = {
  title: 'イベント詳細 | 福岡遊び',
  description: '福岡市内で開催されるイベントの詳細情報です。開催日時、場所、料金などの情報を確認できます。',
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/events" className="text-blue-500 hover:underline">
          ← イベント一覧に戻る
        </Link>
      </div>

      {/* イベント詳細 */}
      <EventDetail eventId={id} />

      {/* 関連イベント */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">関連イベント</h2>
        <EventList limit={4} showAll={false} />
      </section>
    </div>
  );
}

