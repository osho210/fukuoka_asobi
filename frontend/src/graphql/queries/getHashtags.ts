import { gql } from '@apollo/client';

export const GET_HASHTAGS = gql`
  query GetHashtags {
    hashtags {
      id
      hashtagName
    }
  }
`;
