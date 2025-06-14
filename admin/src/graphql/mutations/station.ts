import { gql } from '@apollo/client';

export const CREATE_STATION = gql`
  mutation CreateStation($input: CreateStationInput!) {
    createStation(input: $input) {
      station {
        name
        trainLine
        active
        description
      }
    }
  }
`;

export const UPDATE_STATION = gql`
  mutation UpdateStation($input: UpdateStationInput!) {
    updateStation(input: $input) {
      station {
        id
        name
        trainLine
        active
        description
      }
    }
  }
`;

export const DELETE_STATION = gql`
  mutation DeleteStation($input: DeleteStationInput!) {
    deleteStation(input: $input) {
      success
      errors
    }
  }
`;
