'use client';

import EventList from '@/components/EventList';
import EventCategoryList from '@/components/EventCategoryList';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { EventCategory } from '@/__generated__/graphql';
import '@/styles/EventsPage.css';

const GET_EVENT_CATEGORIES = gql`
  query GetEventCategories {
    eventCategories {
      id
      name
      description
    }
  }
`;

export default function EventsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { loading, error, data } = useQuery<{ eventCategories: EventCategory[] }>(GET_EVENT_CATEGORIES);

  if (loading) return <div className="event-loading-container">読み込み中...</div>;
  if (error) return <div className="event-error-container">エラーが発生しました</div>;

  return (
    <div className="event-container">
      {/* カテゴリーリスト */}
      <section className="event-category-section">
        <EventCategoryList
          categories={data?.eventCategories || []}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </section>

      {/* イベント一覧 */}
      <div className="event-main-content">
        <EventList selectedCategoryId={selectedCategoryId} />
      </div>
    </div>
  );
}
