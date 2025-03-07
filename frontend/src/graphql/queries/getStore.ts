import { gql } from '@apollo/client';

export const GET_STORE = gql`
  query GetStore($id: ID!) {
    store(id: $id) {
      id
      storeName
      address
      phoneNumber
      website
      catchphrase
      recommendedFor1
      recommendedFor2
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
      openingHours {
        id
        dayOfWeek
        openTime
        closeTime
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
      storeAmbiances {
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
