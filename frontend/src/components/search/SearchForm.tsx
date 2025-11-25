'use client';

import React from 'react';
import { SearchParams } from '@/types/search';
import NormalSearchTab from './NormalSearchTab';
import CustomSearchTab from './CustomSearchTab';
import TabSelector from '@/components/common/TabSelector';
import Button from '@/components/common/Button';
import '@/styles/SearchForm.css';

// 検索タブの定義
enum SearchTab {
  Normal = 'normal',
  Custom = 'custom',
}

interface SearchFormProps {
  searchParams: SearchParams;
  updateSearchParams: (updates: Partial<SearchParams>) => void;
  onSearch: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

/**
 * 検索フォームコンポーネント
 * タブ選択、検索条件入力、検索ボタンを提供する
 */
const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  updateSearchParams,
  onSearch,
  isLoading,
  errorMessage,
}) => {
  // 現在のタブ
  const [activeTab, setActiveTab] = React.useState<SearchTab>(SearchTab.Normal);

  // タブの定義
  const tabs = [
    { id: SearchTab.Normal, label: '通常作成' },
    { id: SearchTab.Custom, label: 'カスタム条件' },
  ];

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
          onClick={onSearch}
          className="nextButton"
          disabled={isLoading}
        >
          {isLoading ? 'プラン生成中...' : 'プランを作成する'}
        </Button>
      </div>
    </div>
  );
};

export default SearchForm;
