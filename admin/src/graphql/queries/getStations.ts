import { gql } from '@apollo/client';

export const GET_STATIONS = gql`
  query GetStations {
    stations {
      id
      name
      trainLine
      description
      active
      createdAt
      updatedAt
    }
  }
`;
