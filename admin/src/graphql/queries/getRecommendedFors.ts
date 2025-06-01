import { gql } from '@apollo/client';

export const GET_RECOMMENDED_FORS = gql`
  query GetRecommendedFors {
    recommendedFors {
      id
      name
      createdAt
      updatedAt
    }
  }
`;