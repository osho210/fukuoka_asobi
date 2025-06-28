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
      startDatetime
      endDatetime
      tags
      recommendedForString
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
          imageUrl
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