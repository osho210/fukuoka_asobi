import { gql } from '@apollo/client';

export const CREATE_RECOMMENDED_FOR = gql`
  mutation CreateRecommendedFor($input: CreateRecommendedForInput!) {
    createRecommendedFor(input: $input) {
      recommendedFor {
        id
        name
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_RECOMMENDED_FOR = gql`
  mutation UpdateRecommendedFor($input: UpdateRecommendedForInput!) {
    updateRecommendedFor(input: $input) {
      recommendedFor {
        id
        name
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_RECOMMENDED_FOR = gql`
  mutation DeleteRecommendedFor($input: DeleteRecommendedForInput!) {
    deleteRecommendedFor(input: $input) {
      success
      errors
    }
  }
`;
