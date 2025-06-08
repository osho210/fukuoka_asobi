import { gql } from '@apollo/client';
export const GET_PLAY_PLANS = gql`
  query GetPlayPlans($limit: Int) {
    playPlans(limit: $limit) {
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
      isFavorite
      status
      user {
        id
        username
        profileImageUrl
        role
      }
    }
  }
`;