'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { SearchParams } from '@/types/search';
import { GeneratedPlan } from '@/__generated__/graphql';
import { GENERATE_PLAN } from '@/graphql/generatePlan';

/**
 * プラン生成処理と状態管理を行うカスタムフック
 * GraphQL Mutationの実行、ローディング状態、エラーハンドリングを提供する
 */
export const usePlanGeneration = () => {
  const router = useRouter();

  // 生成されたプラン
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  // ローディング状態
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // GraphQL Mutation
  const [generatePlanMutation] = useMutation(GENERATE_PLAN);

  /**
   * プランを生成
   * @param searchParams - 検索パラメータ
   * @returns 生成が成功した場合はtrue、失敗した場合はfalse
   */
  const generatePlan = async (searchParams: SearchParams): Promise<boolean> => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // GraphQLクエリのパラメータを準備
      const variables = buildGraphQLVariables(searchParams);

      console.log('プラン生成パラメータ:', variables);

      // GraphQLクエリを実行
      const { data } = await generatePlanMutation({ variables });

      // エラーチェック
      if (data.generatePlan.errors && data.generatePlan.errors.length > 0) {
        handleErrors(data.generatePlan.errors);
        return false;
      }

      // 成功時はプランを設定
      setGeneratedPlan(data.generatePlan.plan);
      return true;
    } catch (error) {
      console.error('プラン生成エラー:', error);
      setErrorMessage('プラン生成中にエラーが発生しました。入力内容を確認してください。');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * GraphQL変数を構築
   * @param searchParams - 検索パラメータ
   * @returns GraphQL変数
   */
  const buildGraphQLVariables = (searchParams: SearchParams) => {
    return {
      districts: searchParams.districts,
      date: searchParams.date,
      memberInfo: searchParams.memberInfo,
      budget: searchParams.budget,
      // 時刻をJST（日本標準時）のDateオブジェクトに変換
      startTime: searchParams.startTime
        ? new Date(`${searchParams.date}T${searchParams.startTime}:00+09:00`).toISOString()
        : undefined,
      endTime: searchParams.endTime
        ? new Date(`${searchParams.date}T${searchParams.endTime}:00+09:00`).toISOString()
        : undefined,
      customOptions: searchParams.customOptions,
    };
  };

  /**
   * エラーを処理
   * @param errors - エラーメッセージの配列
   */
  const handleErrors = (errors: string[]) => {
    // 認証エラーの場合はログインページにリダイレクト
    if (errors.some((error: string) => error.includes('ログインが必要'))) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }

    // プレミアムエラーの場合
    if (errors.some((error: string) => error.includes('プレミアムプラン'))) {
      setErrorMessage('この検索条件はプレミアムプランでのみ利用可能です。');
      return;
    }

    // その他のエラー
    setErrorMessage(errors.join(', '));
  };

  /**
   * プラン生成をリセット
   */
  const resetPlan = () => {
    setGeneratedPlan(null);
    setErrorMessage(null);
  };

  /**
   * エラーメッセージをクリア
   */
  const clearError = () => {
    setErrorMessage(null);
  };

  return {
    generatedPlan,
    isLoading,
    errorMessage,
    generatePlan,
    resetPlan,
    clearError,
  };
};
