import { gql } from '@apollo/client';
import { GetPlayPlansQuery, GetPlayPlansQueryVariables } from '@/__generated__/types';

// .graphqlファイルからクエリをインポート
export const GET_PLAY_PLANS = gql`
  query GetPlayPlans($limit: Int, $isRecommended: Boolean) {
    playPlans(limit: $limit, isRecommended: $isRecommended) {
      id
      planName
      catchCopy
      description
      plannerTitle
      subtitle
      imageUrl
      location
      tripType
      totalBudget
      rating
      reviewCount
      favoriteCount
      isFavorite
      isRecommended
      status
      leadText
      createdAt
      imageUrls {
        id
        url
      }
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
      catchCopy
      subtitle
      leadText
      description
      imageUrl
      departure
      departureTime
      travelMethodToFirstSpot
      travelTimeToFirstSpot
      imageUrls {
        id
        url
      }
      imageProperties {
        attachmentId
        url
        isSelected
        position
        comment
      }
      location
      tripType
      totalBudget
      rating
      reviewCount
      favoriteCount
      isFavorite
      isRecommended
      status
      startTime
      endTime
      tags
      recommendUsers
      userId
      user {
        id
        username
        profileImageUrl
        role
      }
      plannerTitle
      plannerDescription
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
        startTime
        durationMinutes
        budget
        notes
        plannerTitle
        plannerDescription
        travelDetails{
          sequenceNumber
          travelMethod
          travelTime
          notes
        }
        spot {
          id
          spotName
          description
          address
          phoneNumber
          budgetRange
          isRainyOk
          website
          nearestStation
          instagramUrl
          reviewCount
          reviewRating
          acceptsCreditCards
          priceRangeStartAmount
          priceRangeEndAmount
          takeout
          reservable
          menus{
            id
            menuName
          }
          spotAmbiances{
            id
            ambianceName
          }
          imageUrl{
            id
            url
          }
          hashtags {
            id
            hashtagName
          }
          catchphrase
          categories{
            name
          }
          openingHours {
            id
            dayOfWeek
            openTime
            closeTime
            isClosedDay
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
