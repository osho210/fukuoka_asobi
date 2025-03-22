import { Suspense } from 'react';
import SearchContainer from '@/components/search/SearchContainer';
import Loading from '@/components/common/Loading';

export const metadata = {
  title: 'プラン検索 | 福岡遊び',
  description: '福岡県内の遊びプランを検索できます。エリア、日時、予算などの条件を指定して、あなたにぴったりのプランを見つけましょう。',
};

export default function SearchPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">プラン検索</h1>
        <Suspense fallback={<Loading />}>
          <SearchContainer />
        </Suspense>
      </div>
    </main>
  );
}
