import { Suspense } from 'react';
import SearchContainer from '@/components/search/SearchContainer';
import Loading from '@/components/common/Loading';
import { Header } from '@/components/Header'


export const metadata = {
  title: 'プラン検索 | 福岡遊び日記',
  description: '福岡県内の遊びプランを検索できます。エリア、日時、予算などの条件を指定して、あなたにぴったりのプランを見つけましょう。',
};

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Suspense fallback={<Loading />}>
            <SearchContainer />
          </Suspense>
        </div>
      </main>
    </>
  );
}
