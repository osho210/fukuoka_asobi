import { gql } from '@apollo/client';

export const GET_LAYOUT_BUCKETS = gql`
  query GetLayoutBuckets($limit: Int) {
    layoutBuckets(limit: $limit) {
      id
      key
      name
      templateKey
      themeKey
      shift
      tilt
      depth
      status
      sortOrder
      bucketListItems {
        id
        title
        status
      }
      createdAt
      updatedAt
    }
  }
`;
