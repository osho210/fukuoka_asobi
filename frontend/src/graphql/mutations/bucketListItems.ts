import { gql } from '@apollo/client';

// バケットリスト企画作成
export const CREATE_BUCKET_LIST_ITEM = gql`
  mutation CreateBucketListItem($input: CreateBucketListItemInput!) {
    createBucketListItem(input: $input) {
      bucketListItem {
        id
        title
        status
        createdAt
      }
      errors
    }
  }
`;

// バケットリスト企画更新
export const UPDATE_BUCKET_LIST_ITEM = gql`
  mutation UpdateBucketListItem($input: UpdateBucketListItemInput!) {
    updateBucketListItem(input: $input) {
      bucketListItem {
        id
        title
        content
        areaText
        weather
        status
        publishedAt
        updatedAt
      }
      errors
    }
  }
`;