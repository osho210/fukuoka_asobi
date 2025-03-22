import { GetOptionsResponse } from '@/types/graphql';
import { useQuery, gql } from '@apollo/client';

// GraphQLクエリの定義
const GET_OPTIONS = gql`
  query GetOptions {
    themeOptions {
      id
      label
    }
    transportationOptions {
      id
      label
    }
    categoryOptions {
      id
      label
    }
  }
`;

/**
 * 選択肢データを取得するためのカスタムフック
 * @returns テーマ、移動手段、カテゴリーの選択肢データ
 */
export const useOptions = () => {
  const { data, loading, error } = useQuery<GetOptionsResponse>(GET_OPTIONS);

  return {
    themeOptions: data?.themeOptions || [],
    transportationOptions: data?.transportationOptions || [],
    categoryOptions: data?.categoryOptions || [],
    loading,
    error
  };
};
