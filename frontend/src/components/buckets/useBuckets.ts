'use client';

import { useQuery } from '@apollo/client';
import { GET_BUCKET_LIST_ITEMS, GET_BUCKET_LIST_ITEM } from '@/graphql/queries/bucketListItems';
import { GetBucketListItemsQuery, GetBucketListItemQuery, GetBucketListItemQueryVariables } from '@/__generated__/types';

/**
 * バケットリストアイテム一覧を取得するカスタムフック
 */
export const useBucketListItems = (
    limit?: number,
    offset?: number,
    status?: string,
    weather?: string
) => {
    const { loading, error, data, refetch } = useQuery<GetBucketListItemsQuery>(GET_BUCKET_LIST_ITEMS, {
        variables: { limit, offset, status, weather },
        fetchPolicy: 'network-only',
    });

    return {
        bucketListItems: data?.bucketListItems,
        loading,
        error,
        refetch,
    };
};

/**
 * 特定のバケットリストアイテムを取得するカスタムフック
 */
export const useBucketListItem = (id: string) => {
    const { loading, error, data, refetch } = useQuery<GetBucketListItemQuery, GetBucketListItemQueryVariables>(GET_BUCKET_LIST_ITEM, {
        variables: { id },
        fetchPolicy: 'network-only',
    });

    return {
        bucketListItem: data?.bucketListItem || null,
        loading,
        error,
        refetch,
    };
};
