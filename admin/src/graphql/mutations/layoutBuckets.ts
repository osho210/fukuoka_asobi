import { gql } from '@apollo/client';

export const CREATE_LAYOUT_BUCKET = gql`
  mutation CreateLayoutBucket($input: CreateLayoutBucketInput!) {
    createLayoutBucket(input: $input) {
      layoutBucket {
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
        createdAt
      }
      errors
    }
  }
`;

export const UPDATE_LAYOUT_BUCKET = gql`
  mutation UpdateLayoutBucket($input: UpdateLayoutBucketInput!) {
    updateLayoutBucket(input: $input) {
      layoutBucket {
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
        updatedAt
      }
      errors
    }
  }
`;
