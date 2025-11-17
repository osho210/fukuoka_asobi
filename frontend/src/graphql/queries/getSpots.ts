import { gql } from '@apollo/client';

export const GET_SPOTS = gql`
  query GetSpots {
    spots {
      id
      spotName
      description
      address
      catchphrase
      parkingAvailable
      reviewRating
      reviewCount
      budgetRange
      theme
      imageUrl{
        id
        url
      }
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
    categories {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
