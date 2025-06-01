import { gql } from '@apollo/client';

export const GET_SPOTS = gql`
  query GetSpots {
    spots {
      id
      spotName
      address
      district {
        id
        districtName
      }
      districtId
      phoneNumber
      website
      catchphrase
      isRainyOk
      budgetRange
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
      purposes {
        id
        purposeName
      }
      spotAmbiances {
        id
        ambianceName
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPOT = gql`
  query GetSpot($id: ID!) {
    spot(id: $id) {
      id
      spotName
      address
      district {
        id
        districtName
      }
      districtId
      phoneNumber
      website
      catchphrase
      isRainyOk
      budgetRange
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
      purposes {
        id
        purposeName
      }
      spotAmbiances {
        id
        ambianceName
      }
      createdAt
      updatedAt
    }
  }
`;
