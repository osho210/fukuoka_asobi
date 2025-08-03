import { gql } from '@apollo/client';
import { GetRecommendedSpotsQuery } from '@/__generated__/types';

// .graphqlファイルからクエリをインポート
export const GET_RECOMMENDED_SPOTS = gql`
  query GetRecommendedSpots {
    spots {
      id
      spotName
      spotType
      address
      reviewRating
      reviewCount
      imageUrl{
        id
        url
      }
      district {
        districtName
      }
      categories {
        name
      }
    }
  }
`;

export type { GetRecommendedSpotsQuery };
