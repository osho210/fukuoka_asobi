'use client';

import { useQuery } from '@apollo/client';
import { GET_EVENT } from '../../../graphql/queries/getEvent';
import { Event } from '@/__generated__/graphql';
import EventDetailAdapter from '@/components/adapters/EventDetailAdapter';

interface EventDetailContainerProps {
  eventId: string;
}

interface EventData {
  event: Event;
}

export default function EventDetailContainer({ eventId }: EventDetailContainerProps) {
  const { loading, error, data } = useQuery<EventData>(GET_EVENT, {
    variables: { id: eventId },
  });

  if (loading) return <div className="content-detail-loading">読み込み中...</div>;
  if (error) return <div className="content-detail-error">エラーが発生しました: {error.message}</div>;
  if (!data || !data.event) return <div className="content-detail-not-found">イベントが見つかりません</div>;

  return <EventDetailAdapter event={data.event} />;
}
