import { gql } from '@apollo/client';

// GraphQLクエリとミューテーションの定義
export const GET_USER_FAVORITES = gql`
  query GetUserFavorites {
    userFavorites {
      id
      playPlanId
      createdAt
      playPlan {
        id
        planName
        description
        imageUrl
        location
        tripType
        totalBudget
        rating
        reviewCount
        favoriteCount
        status
        tags
        user {
          id
          username
          profileImageUrl
          role
        }
      }
    }
  }
`;

export const IS_FAVORITE = gql`
  query IsFavorite($playPlanId: ID!) {
    isFavorite(playPlanId: $playPlanId)
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($playPlanId: ID!) {
    addFavorite(input: { playPlanId: $playPlanId }) {
      favorite {
        id
        playPlanId
        createdAt
      }
      errors
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($playPlanId: ID!) {
    removeFavorite(input: { playPlanId: $playPlanId }) {
      success
      errors
    }
  }
`;

// Re-export types from generated GraphQL types
export type {
  GetUserFavoritesQuery,
  IsFavoriteQuery,
  IsFavoriteQueryVariables,
  AddFavoriteMutation,
  AddFavoriteMutationVariables,
  RemoveFavoriteMutation,
  RemoveFavoriteMutationVariables,
} from '@/__generated__/types';
