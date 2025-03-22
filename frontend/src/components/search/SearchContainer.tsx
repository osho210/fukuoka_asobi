'use client';

import React, { useState } from 'react';
import { SearchParams } from '@/types/search';
import NormalSearchTab from './NormalSearchTab';
import CustomSearchTab from './CustomSearchTab';
import AreaSelector from './AreaSelector';
import DateTimeSelector from './DateTimeSelector';
import TabSelector from '@/components/common/TabSelector';
import Button from '@/components/common/Button';
import styles from '@/styles/SearchForm.module.css';

// 検索ステップの定義
enum SearchStep {
  Conditions = 'conditions',
  AreaSelection = 'area_selection',
  DateTimeSelection = 'datetime_selection',
}

// 検索タブの定義
enum SearchTab {
  Normal = 'normal',
  Custom = 'custom',
}

const SearchContainer: React.FC = () => {
  // 現在のステップ
  const [currentStep, setCurrentStep] = useState<SearchStep>(SearchStep.Conditions);

  // 現在のタブ
  const [activeTab, setActiveTab] = useState<SearchTab>(SearchTab.Normal);

  // 検索条件
  const [searchParams, setSearchParams] = useState<SearchParams>({
    areas: [],
    date: '',
    genderInfo: { male: 0, female: 0 },
    budget: { min: 0, max: 50000 },
  });

  // 検索条件の更新
  const updateSearchParams = (updates: Partial<SearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...updates }));
  };

  // 次のステップへ進む
  const goToNextStep = () => {
    if (currentStep === SearchStep.Conditions) {
      setCurrentStep(SearchStep.AreaSelection);
    } else if (currentStep === SearchStep.AreaSelection) {
      setCurrentStep(SearchStep.DateTimeSelection);
    }
  };

  // 前のステップへ戻る
  const goToPreviousStep = () => {
    if (currentStep === SearchStep.DateTimeSelection) {
      setCurrentStep(SearchStep.AreaSelection);
    } else if (currentStep === SearchStep.AreaSelection) {
      setCurrentStep(SearchStep.Conditions);
    }
  };

  // 検索を実行
  const handleSearch = async () => {
    console.log('検索条件:', searchParams);

    try {
      // GraphQLクエリのパラメータを準備
      const variables = {
        areas: searchParams.areas,
        date: searchParams.date,
        genderInfo: searchParams.genderInfo,
        budget: searchParams.budget,
        customOptions: searchParams.customOptions
      };

      // GraphQLクエリを実行
      // 注: 実際の実装では、Apollo Clientなどを使用してクエリを実行します
      // const { data } = await client.query({
      //   query: SEARCH_PLANS_QUERY,
      //   variables
      // });

      // 検索結果を処理
      // setSearchResults(data.searchPlans);

      // 検索結果画面に遷移
      // router.push('/search/results');

      // 開発中は結果をコンソールに出力
      console.log('検索パラメータ:', variables);
      alert('検索機能は開発中です。検索条件がコンソールに出力されました。');
    } catch (error) {
      console.error('検索エラー:', error);
      alert('検索中にエラーが発生しました。');
    }
  };

  // タブの定義
  const tabs = [
    { id: SearchTab.Normal, label: '通常検索' },
    { id: SearchTab.Custom, label: 'カスタム条件' },
  ];

  // 現在のステップに応じたコンポーネントを表示
  const renderCurrentStep = () => {
    switch (currentStep) {
      case SearchStep.Conditions:
        return (
          <>
            <TabSelector
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as SearchTab)}
            />
            <div className={styles.formSection}>
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
            <div className={styles.buttonContainer}>
              <Button
                onClick={goToNextStep}
                className={styles.nextButton}
              >
                次へ進む
              </Button>
            </div>
          </>
        );
      case SearchStep.AreaSelection:
        return (
          <>
            <AreaSelector
              selectedAreas={searchParams.areas}
              onChange={(areas: string[]) => updateSearchParams({ areas })}
            />
            <div className={styles.buttonContainer}>
              <Button
                onClick={goToPreviousStep}
                variant="outline"
                className={styles.nextButton}
              >
                戻る
              </Button>
              <Button
                onClick={goToNextStep}
                className={styles.nextButton}
              >
                次へ進む
              </Button>
            </div>
          </>
        );
      case SearchStep.DateTimeSelection:
        return (
          <>
            <DateTimeSelector
              date={searchParams.date}
              startTime={searchParams.startTime}
              endTime={searchParams.endTime}
              onChange={(date: string, startTime: string, endTime: string) =>
                updateSearchParams({ date, startTime, endTime })
              }
            />
            <div className={styles.buttonContainer}>
              <Button
                onClick={goToPreviousStep}
                variant="outline"
                className={styles.nextButton}
              >
                戻る
              </Button>
              <Button
                onClick={handleSearch}
                className={styles.nextButton}
              >
                検索する
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.searchFormContainer}>
      {renderCurrentStep()}
    </div>
  );
};

export default SearchContainer;
