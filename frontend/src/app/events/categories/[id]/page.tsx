'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { gql } from '@apollo/client';
import EventList from '@/components/EventList';
import EventCategoryList from '@/components/EventCategoryList';
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

const GET_EVENT_CATEGORY = gql`
  query GetEventCategory($id: ID!) {
    eventCategory(id: $id) {
      id
      name
      description
    }
  }
`;

export default function CategoryPage() {
  const params = useParams();
  const categoryId = (params?.id as string) || '';
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryId || null);

  const { data: categoriesData } = useQuery<{ eventCategories: EventCategory[] }>(GET_EVENT_CATEGORIES);
  const { data: categoryData } = useQuery<{ eventCategory: EventCategory }>(GET_EVENT_CATEGORY, {
    variables: { id: categoryId },
  });

  const categoryName = categoryData?.eventCategory?.name || 'カテゴリ';

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
            <EventCategoryList
              categories={categoriesData?.eventCategories || []}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="event-category-main-content">
          <section className="event-category-upcoming-section">
            <h2 className="event-category-section-heading">イベント一覧</h2>
            <EventList selectedCategoryId={selectedCategoryId} />
          </section>
        </div>
      </div>
    </div>
  );
}
