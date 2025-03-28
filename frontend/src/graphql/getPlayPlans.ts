import { gql } from '@apollo/client';
import { GetPlayPlansQuery, GetPlayPlansQueryVariables } from '@/__generated__/types';

// .graphqlファイルからクエリをインポート
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

export type { GetPlayPlansQuery, GetPlayPlansQueryVariables };
