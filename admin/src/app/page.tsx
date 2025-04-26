'use client';

import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// 統計情報を取得するクエリ（実際のGraphQLスキーマに合わせて調整が必要）
const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    spotsCount
    areasCount
    categoriesCount
    playPlansCount
    eventsCount
    newsCount
  }
`;

// 初期状態
const initialStats = {
  spotsCount: 0,
  areasCount: 0,
  categoriesCount: 0,
  playPlansCount: 0,
  eventsCount: 0,
  newsCount: 0
};

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const { loading, error } = useQuery(GET_DASHBOARD_STATS, {
    onCompleted: (data) => {
      if (data) {
        setStats(data);
      }
    },
    onError: (error) => {
      console.error('GraphQLクエリエラー:', error.message);
    }
  });

  return (
    <div className="space-y-6">
      {loading && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-blue-700">データを読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <p className="text-red-700">エラーが発生しました: {error.message}</p>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold mb-2">管理ダッシュボード</h1>
        <p className="text-gray-600">福岡遊びサービスの管理画面へようこそ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* スポット */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">スポット</h2>
          <p className="text-3xl font-bold text-primary">{stats.spotsCount}</p>
          <div className="mt-4">
            <a href="/admin/spots" className="text-primary hover:underline text-sm">
              スポット一覧を見る →
            </a>
          </div>
        </div>

        {/* エリア */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">エリア</h2>
          <p className="text-3xl font-bold text-primary">{stats.areasCount}</p>
          <div className="mt-4">
            <a href="/admin/areas" className="text-primary hover:underline text-sm">
              エリア一覧を見る →
            </a>
          </div>
        </div>

        {/* カテゴリー */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">カテゴリー</h2>
          <p className="text-3xl font-bold text-primary">{stats.categoriesCount}</p>
          <div className="mt-4">
            <a href="/admin/categories" className="text-primary hover:underline text-sm">
              カテゴリー一覧を見る →
            </a>
          </div>
        </div>

        {/* 遊びプラン */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">遊びプラン</h2>
          <p className="text-3xl font-bold text-primary">{stats.playPlansCount}</p>
          <div className="mt-4">
            <a href="/admin/play_plans" className="text-primary hover:underline text-sm">
              遊びプラン一覧を見る →
            </a>
          </div>
        </div>

        {/* イベント */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">イベント</h2>
          <p className="text-3xl font-bold text-primary">{stats.eventsCount}</p>
          <div className="mt-4">
            <a href="/admin/events" className="text-primary hover:underline text-sm">
              イベント一覧を見る →
            </a>
          </div>
        </div>

        {/* ニュース */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">ニュース</h2>
          <p className="text-3xl font-bold text-primary">{stats.newsCount}</p>
          <div className="mt-4">
            <a href="/admin/news" className="text-primary hover:underline text-sm">
              ニュース一覧を見る →
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">クイックアクセス</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/spots/new"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50"
          >
            <h3 className="font-medium">新規スポット登録</h3>
            <p className="text-sm text-gray-600 mt-1">新しいスポット情報を登録します</p>
          </a>
          <a
            href="/admin/play_plans/new"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50"
          >
            <h3 className="font-medium">新規遊びプラン作成</h3>
            <p className="text-sm text-gray-600 mt-1">新しい遊びプランを作成します</p>
          </a>
          <a
            href="/admin/events/new"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50"
          >
            <h3 className="font-medium">新規イベント登録</h3>
            <p className="text-sm text-gray-600 mt-1">新しいイベント情報を登録します</p>
          </a>
          <a
            href="/admin/news/new"
            className="block p-4 border border-gray-200 rounded hover:bg-gray-50"
          >
            <h3 className="font-medium">新規ニュース作成</h3>
            <p className="text-sm text-gray-600 mt-1">新しいニュース記事を作成します</p>
          </a>
        </div>
      </div>
    </div>
  );
}
