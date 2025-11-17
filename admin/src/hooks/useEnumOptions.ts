import { useQuery } from '@apollo/client';
import { GET_ENUM_VALUES } from '@/graphql/queries/getEnumTypes';
import { __EnumValue, __Type } from '@/__generated__/graphql';

// Query response type
interface QueryData {
  __type: __Type;
}

interface SelectOption {
  value: string;
  label: string;
}

/**
 * GraphQLのEnum値を取得し、react-selectで使える形式に変換するカスタムフック
 * @param enumName - 取得したいEnumの型名 (例: "BusinessStatus")
 * @returns { options: SelectOption[], loading: boolean, error: any }
 */
export const useEnumOptions = (enumName: string) => {
  const { data, loading, error } = useQuery<QueryData>(GET_ENUM_VALUES, {
    variables: { name: enumName },
    skip: !enumName,
  });

  const options: SelectOption[] =
    data?.__type?.enumValues?.map((enumValue: __EnumValue) => ({
      value: enumValue.name,
      label: enumValue.description || enumValue.name,
    })) || [];

  return { options, loading, error };
};
