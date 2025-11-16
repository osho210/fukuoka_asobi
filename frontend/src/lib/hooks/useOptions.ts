import { GetOptionsQuery } from '@/__generated__/types';
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
  const { data, loading, error } = useQuery<GetOptionsQuery>(GET_OPTIONS);

  return {
    themeOptions: data?.themeOptions || [],
    transportationOptions: data?.transportationOptions || [],
    categoryOptions: data?.categoryOptions || [],
    loading,
    error
  };
};
