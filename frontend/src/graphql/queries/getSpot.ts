import { gql } from '@apollo/client';

export const GET_SPOT = gql`
  query GetSpot($id: ID!) {
    spot(id: $id) {
      id
      spotName
      address
      phoneNumber
      website
      catchphrase
      recommendedFor1
      recommendedFor2
      parkingAvailable
      nearestStation
      openingHourList {
        dayOfWeek
        businessHour
      }
      closedDays
      reviewRating
      reviewCount
      instagramUrl
      isClosed
      budgetRange
      maxPeople
      minPeople
      isRainyOk
      theme
      spotType
      district {
        id
        districtName
      }
      areas {
        id
        areaName
      }
      categories {
        id
        name
      }
      hashtags {
        id
        hashtagName
      }
      instagramEmbeds {
        id
        instagramEmbedName
        embedCode
        embedUrl
      }
      menus {
        id
        menuName
        price
        description
      }
      spotAmbiances {
        id
        ambianceName
      }
      purposes {
        id
        purposeName
      }
    }
  }
`;
