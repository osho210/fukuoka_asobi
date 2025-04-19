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
      parkingAvailable
      nearestStation
      reviewRating
      reviewCount
      instagramUrl
      isClosed
      budgetRange
      maxPeople
      minPeople
      isRainyOk
      theme
      imageUrl
      spotType
      createdAt
      updatedAt
      district {
        id
        districtName
      }
      openingHourList {
        dayOfWeek
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
