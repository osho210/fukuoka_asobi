'use client';

import { useState } from 'react';
import { SearchParams } from '@/types/search';

/**
 * 検索パラメータの状態管理を行うカスタムフック
 * 検索条件の初期化、更新、バリデーションを提供する
 */
export const useSearchParams = () => {
  // 検索条件の初期値
  const initialSearchParams: SearchParams = {
    districts: [],
    date: '',
    memberInfo: { recommendUsers: [] },
    budget: { min: 0, max: 20000 },
  };

  // 検索条件の状態
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams);

  /**
   * 検索条件を更新
   * @param updates - 更新する検索条件の部分オブジェクト
   */
  const updateSearchParams = (updates: Partial<SearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...updates }));
  };

  /**
   * 検索条件をリセット
   */
  const resetSearchParams = () => {
    setSearchParams(initialSearchParams);
  };

  /**
   * 特定のフィールドを更新
   * @param field - 更新するフィールド名
   * @param value - 新しい値
   */
  const updateField = <K extends keyof SearchParams>(field: K, value: SearchParams[K]) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  return {
    searchParams,
    updateSearchParams,
    resetSearchParams,
    updateField,
  };
};
