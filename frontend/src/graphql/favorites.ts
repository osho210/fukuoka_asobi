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

// 型定義
export interface Favorite {
  id: string;
  playPlanId: string;
  createdAt: string;
  playPlan?: {
    id: string;
    planName: string;
    description?: string;
    imageUrl?: string;
    location?: string;
    tripType: string;
    totalBudget?: number;
    rating: number;
    reviewCount: number;
    favoriteCount: number;
    status: string;
    user?: {
      id: string;
      username: string;
      profileImageUrl?: string;
      role: string;
    };
  };
}

export interface GetUserFavoritesQuery {
  userFavorites: Favorite[];
}

export interface IsFavoriteQuery {
  isFavorite: boolean;
}

export interface IsFavoriteQueryVariables {
  playPlanId: string;
}

export interface AddFavoriteMutation {
  addFavorite: {
    favorite: {
      id: string;
      playPlanId: string;
      createdAt: string;
    } | null;
    errors: string[];
  };
}

export interface AddFavoriteMutationVariables {
  playPlanId: string;
}

export interface RemoveFavoriteMutation {
  removeFavorite: {
    success: boolean;
    errors: string[];
  };
}

export interface RemoveFavoriteMutationVariables {
  playPlanId: string;
}
