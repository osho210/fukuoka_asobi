import { gql } from '@apollo/client';

export const GET_STORES = gql`
  query GetStores {
    stores {
      id
      storeName
      address
      catchphrase
      parkingAvailable
      reviewRating
      reviewCount
      budgetRange
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
    }
  }
`;
