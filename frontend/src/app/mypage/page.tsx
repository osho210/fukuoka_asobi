'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '@/graphql/mypage';
import MyPageTabs from '@/components/mypage/MyPageTabs';
import { UserPlayPlans } from '@/components/mypage/UserPlayPlans';
import { UserBookmarks } from '@/components/mypage/UserBookmarks';
import { ProfileEditor } from '@/components/mypage/ProfileEditor';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('plans');

  // 現在のユーザー情報を取得
  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only', // キャッシュを使わず常に最新データを取得
  });

  // ログインしていない場合はリダイレクト
  useEffect(() => {
    if (!loading && !data?.currentUser) {
      router.push('/login');
    }
  }, [loading, data, router]);

  // ローディング中の表示
  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="container mx-auto p-4 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">エラーが発生しました。</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      </div>
    );
  }

  // ユーザーが取得できない場合
  if (!data?.currentUser) {
    return null; // useEffectでリダイレクト処理を行うため、ここでは何も表示しない
  }

  // タブの設定
  const tabs = [
    {
      id: 'plans',
      label: '作成したプラン',
      content: <UserPlayPlans />
    },
    {
      id: 'bookmarks',
      label: 'ブックマーク',
      content: <UserBookmarks />
    },
    {
      id: 'profile',
      label: 'プロフィール',
      content: <ProfileEditor user={data.currentUser} onUpdate={refetch} />
    }
  ];

  return (
    <>
      <div className="">
        <MyPageTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </>
  );
}
