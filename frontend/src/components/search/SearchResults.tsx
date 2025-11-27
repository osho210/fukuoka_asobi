'use client';

import React from 'react';
import { GeneratedPlan } from '@/__generated__/graphql';
import GeneratedPlanView from '@/components/GeneratedPlanView';

interface SearchResultsProps {
  plan: GeneratedPlan;
  onSave: () => void;
  onEdit: () => void;
}

/**
 * 検索結果（生成されたプラン）を表示するコンポーネント
 */
const SearchResults: React.FC<SearchResultsProps> = ({ plan, onSave, onEdit }) => {
  return (
    <div className="searchResultContainer">
      <GeneratedPlanView plan={plan} onSave={onSave} onEdit={onEdit} />
    </div>
  );
};

export default SearchResults;
