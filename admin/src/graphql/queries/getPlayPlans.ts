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
      userId
      location
      tripType
      totalBudget
      rating
      reviewCount
      favoriteCount
      isFavorite
      status
      startTime
      endTime
      tags
      # TODO: nameも取得して渡す
      recommendUsers
      plannerTitle
      plannerDescription
      planDetails {
        id
        stepNumber
        stepName
        stepDescription
        comment
        startTime
        endTime
        durationMinutes
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
