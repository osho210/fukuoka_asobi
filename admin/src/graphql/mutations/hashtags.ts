import { gql } from '@apollo/client';

export const CREATE_HASHTAG = gql`
  mutation CreateHashtag($input: CreateHashtagInput!) {
    createHashtag(input: $input) {
      hashtag {
        id
        hashtagName
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_HASHTAG = gql`
  mutation UpdateHashtag($input: UpdateHashtagInput!) {
    updateHashtag(input: $input) {
      hashtag {
        id
        hashtagName
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_HASHTAG = gql`
  mutation DeleteHashtag($input: DeleteHashtagInput!) {
    deleteHashtag(input: $input) {
      success
      errors
    }
  }
`;
