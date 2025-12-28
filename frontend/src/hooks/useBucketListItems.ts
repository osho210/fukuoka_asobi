import { useQuery, useMutation } from '@apollo/client';
import {
  GET_BUCKET_LIST_ITEMS,
  GET_BUCKET_LIST_ITEM,
  GET_PUBLISHED_BUCKET_LIST_ITEMS,
} from '@/graphql/queries/bucketListItems';
import {
  CREATE_BUCKET_LIST_ITEM,
  UPDATE_BUCKET_LIST_ITEM,
  DELETE_BUCKET_LIST_ITEM,
} from '@/graphql/mutations/bucketListItems';

/**
 * バケットリスト企画一覧を取得するフック
 */
export function useBucketListItems(limit: number = 10, status?: string, weather?: string) {
  const { loading, error, data, refetch } = useQuery(
    GET_BUCKET_LIST_ITEMS,
    {
      variables: { limit, status, weather },
    }
  );

  return {
    items: data?.bucketListItems ?? [],
    loading,
    error,
    refetch,
  };
}

/**
 * 公開済みバケットリスト企画を取得するフック（フロント用）
 */
export function usePublishedBucketListItems(limit: number = 10, weather?: string) {
  const { loading, error, data } = useQuery(
    GET_PUBLISHED_BUCKET_LIST_ITEMS,
    {
      variables: { limit, weather },
    }
  );

  return {
    items: data?.bucketListItems ?? [],
    loading,
    error,
  };
}

/**
 * バケットリスト企画詳細を取得するフック
 */
export function useBucketListItem(id: string) {
  const { loading, error, data } = useQuery(
    GET_BUCKET_LIST_ITEM,
    {
      variables: { id },
      skip: !id,
    }
  );

  return {
    item: data?.bucketListItem,
    loading,
    error,
  };
}

/**
 * バケットリスト企画を作成するミューテーション
 */
export function useCreateBucketListItem() {
  const [mutate, { loading, error }] = useMutation(
    CREATE_BUCKET_LIST_ITEM,
    {
      refetchQueries: [{ query: GET_BUCKET_LIST_ITEMS }],
    }
  );

  return {
    create: (input: Record<string, unknown>) => mutate({ variables: { input } }),
    loading,
    error,
  };
}

/**
 * バケットリスト企画を更新するミューテーション
 */
export function useUpdateBucketListItem() {
  const [mutate, { loading, error }] = useMutation(
    UPDATE_BUCKET_LIST_ITEM,
    {
      refetchQueries: [{ query: GET_BUCKET_LIST_ITEMS }],
    }
  );

  return {
    update: (id: string, input: Record<string, unknown>) => mutate({ variables: { id, input } }),
    loading,
    error,
  };
}

/**
 * バケットリスト企画を削除するミューテーション
 */
export function useDeleteBucketListItem() {
  const [mutate, { loading, error }] = useMutation(
    DELETE_BUCKET_LIST_ITEM,
    {
      refetchQueries: [{ query: GET_BUCKET_LIST_ITEMS }],
    }
  );

  return {
    delete: (id: string) => mutate({ variables: { id } }),
    loading,
    error,
  };
}
