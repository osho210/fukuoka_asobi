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

export const GET_PLAY_PLAN = gql`
  query GetPlayPlan($id: Int!) {
    playPlan(id: $id) {
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
      startDatetime
      endDatetime
      tags
      recommendUsers
      recommendedFors {
        id
        name
      }
      planDetails {
        id
        stepNumber
        stepName
        stepDescription
        comment
        startDatetime
        endDatetime
        budget
        notes
        spot {
          id
          spotName
          address
          phoneNumber
          budgetRange
          isRainyOk
          imageUrl{
            id
            url
          }
          catchphrase
          categories{
            name
          }
          district{
            districtName
          }
        }
      }
    }
  }
`;

export type { GetPlayPlansQuery, GetPlayPlansQueryVariables };
