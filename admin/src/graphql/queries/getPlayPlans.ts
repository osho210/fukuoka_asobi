import { gql } from '@apollo/client';
export const GET_PLAY_PLANS = gql`
  query GetPlayPlans($limit: Int) {
    playPlans(limit: $limit) {
      id
      planName
      description
      imageUrl
      imageUrls {
        id
        url
      }
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
      # TODO: nameも取得して渡す
      recommendUsers
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
          imageUrl {
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
        travelDetails {
          id
          sequenceNumber
          travelMethod
          travelTime
          notes
        }
      }
    }
  }
`;
