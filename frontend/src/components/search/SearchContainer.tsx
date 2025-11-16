'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { SearchParams } from '@/types/search';
import NormalSearchTab from './NormalSearchTab';
import CustomSearchTab from './CustomSearchTab';
import TabSelector from '@/components/common/TabSelector';
import Button from '@/components/common/Button';
import GeneratedPlanView from '@/components/GeneratedPlanView';
import '@/styles/SearchForm.css';
import { GeneratedPlan } from '@/__generated__/graphql';

// GraphQLクエリのインポート
import { GENERATE_PLAN } from '../../graphql/generatePlan';

// 検索タブの定義
enum SearchTab {
  Normal = 'normal',
  Custom = 'custom',
}

const SearchContainer: React.FC = () => {
  const router = useRouter();

  // 現在のタブ
  const [activeTab, setActiveTab] = useState<SearchTab>(SearchTab.Normal);

  // 検索条件
  const [searchParams, setSearchParams] = useState<SearchParams>({
    districts: [],
    date: '',
    memberInfo: { recommendUsers: [] },
    budget: { min: 0, max: 20000 },
  });

  // 生成されたプラン
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  // ローディング状態
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // GraphQL Mutation
  const [generatePlan] = useMutation(GENERATE_PLAN);

  // 検索条件の更新
  const updateSearchParams = (updates: Partial<SearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...updates }));
  };

  // 検索を実行
  const handleSearch = async () => {
    // 必須項目のバリデーション
    if (!searchParams.date) {
      setErrorMessage('日付を選択してください');
      return;
    }

    if (searchParams.districts.length === 0) {
      setErrorMessage('エリアを選択してください');
      return;
    }

    if (searchParams.memberInfo.recommendUsers.length === 0) {
      setErrorMessage('利用メンバーを選択してください');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      // GraphQLクエリのパラメータを準備
      const variables = {
        districts: searchParams.districts,
        date: searchParams.date,
        memberInfo: searchParams.memberInfo,
        budget: searchParams.budget,
        // 時刻をJST（日本標準時）のDateオブジェクトに変換
        startTime: searchParams.startTime ? new Date(`${searchParams.date}T${searchParams.startTime}:00+09:00`).toISOString() : undefined,
        endTime: searchParams.endTime ? new Date(`${searchParams.date}T${searchParams.endTime}:00+09:00`).toISOString() : undefined,
        customOptions: searchParams.customOptions
      };

      console.log('プラン生成パラメータ:', variables);

      // GraphQLクエリを実行
      const { data } = await generatePlan({ variables });

      // 生成されたプランを設定
      if (data.generatePlan.errors && data.generatePlan.errors.length > 0) {
        // 認証エラーの場合はログインページにリダイレクト
        if (data.generatePlan.errors.some((error: string) => error.includes('ログインが必要'))) {
          // 現在のURLをクエリパラメータとして渡し、ログイン後に戻れるようにする
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          router.push(`/login?returnUrl=${returnUrl}`);
          return;
        }

        setErrorMessage(data.generatePlan.errors.join(', '));
        return;
      }

      setGeneratedPlan(data.generatePlan.plan);
    } catch (error) {
      console.error('プラン生成エラー:', error);
      setErrorMessage('プラン生成中にエラーが発生しました。入力内容を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  // プラン生成をリセット
  const resetPlan = () => {
    setGeneratedPlan(null);
  };

  // プランを保存
  const savePlan = () => {
    alert('プランを保存しました！');
    // 実際の実装では、保存APIを呼び出す
  };

  // タブの定義
  const tabs = [
    { id: SearchTab.Normal, label: '通常作成' },
    { id: SearchTab.Custom, label: 'カスタム条件' },
  ];

  // 生成されたプランがある場合はそれを表示
  if (generatedPlan) {
    return (
      <div className="searchResultContainer">
        <GeneratedPlanView
          plan={generatedPlan}
          onSave={savePlan}
          onEdit={resetPlan}
        />
      </div>
    );
  }

  return (
    <div className="searchFormContainer">
      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as SearchTab)}
      />
      <div className="formSection">
        {activeTab === SearchTab.Normal ? (
          <NormalSearchTab
            searchParams={searchParams}
            updateSearchParams={updateSearchParams}
          />
        ) : (
          <CustomSearchTab
            searchParams={searchParams}
            updateSearchParams={updateSearchParams}
          />
        )}
      </div>
      {errorMessage && (
        <div className="errorMessage">
          {errorMessage}
        </div>
      )}
      <div className="buttonContainer">
        <Button
          onClick={handleSearch}
          className="nextButton"
          disabled={isLoading}
        >
          {isLoading ? 'プラン生成中...' : 'プランを作成する'}
        </Button>
      </div>
    </div>
  );
};

export default SearchContainer;
