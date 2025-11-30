'use client';

import React from 'react';
import { useSearchParams } from '@/lib/hooks/useSearchParams';
import { usePlanGeneration } from '@/lib/hooks/usePlanGeneration';
import { useSearchValidation } from '@/lib/hooks/useSearchValidation';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import '@/styles/SearchForm.css';

/**
 * 検索機能の全体を制御するコンテナコンポーネント
 * カスタムフックを使用して状態管理とロジックを分離し、
 * SearchFormとSearchResultsコンポーネントを連携させる
 */
const SearchContainer: React.FC = () => {
  // 検索パラメータの管理
  const { searchParams, updateSearchParams } = useSearchParams();

  // プラン生成処理と状態管理
  const { generatedPlan, isLoading, errorMessage, generatePlan, resetPlan } = usePlanGeneration();

  // バリデーション
  const { validateAll, errors, clearAllErrors } = useSearchValidation();

  /**
   * 検索を実行
   */
  const handleSearch = async () => {
    // フロントエンドバリデーション
    const isValid = validateAll({
      date: searchParams.date,
      districts: searchParams.districts,
      memberInfo: {
        ...searchParams.memberInfo,
        recommendUsers: searchParams.memberInfo.recommendUsers.map(Number),
      },
      budget: {
        min: searchParams.budget?.min ?? 0,
        max: searchParams.budget?.max ?? 0,
      },
      startTime: searchParams.startTime,
      endTime: searchParams.endTime,
    });

    if (!isValid) {
      // バリデーションエラーがある場合は処理を中断
      // errorsはSearchFormに自動的に渡される
      return;
    }

    // バリデーションエラーをクリア
    clearAllErrors();

    // プラン生成を実行
    await generatePlan(searchParams);
  };

  /**
   * プランを保存
   */
  const savePlan = () => {
    alert('プランを保存しました！');
    // TODO: 実際の実装では、保存APIを呼び出す
  };

  // 生成されたプランがある場合はそれを表示
  if (generatedPlan) {
    return <SearchResults plan={generatedPlan} onSave={savePlan} onEdit={resetPlan} />;
  }

  // 検索フォームを表示
  return (
    <SearchForm
      searchParams={searchParams}
      updateSearchParams={updateSearchParams}
      onSearch={handleSearch}
      isLoading={isLoading}
      errorMessage={errorMessage ?? Object.values(errors)[0] ?? null}
    />
  );
};

export default SearchContainer;

