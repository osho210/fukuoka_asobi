import { gql } from '@apollo/client';

export const CREATE_SPOT_AMBIANCE = gql`
  mutation CreateSpotAmbiance($input: CreateSpotAmbianceInput!) {
    createSpotAmbiance(input: $input) {
      spotAmbiance {
        id
        ambianceName
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_SPOT_AMBIANCE = gql`
  mutation UpdateSpotAmbiance($input: UpdateSpotAmbianceInput!) {
    updateSpotAmbiance(input: $input) {
      spotAmbiance {
        id
        ambianceName
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_SPOT_AMBIANCE = gql`
  mutation DeleteSpotAmbiance($input: DeleteSpotAmbianceInput!) {
    deleteSpotAmbiance(input: $input) {
      success
      errors
    }
  }
`;
