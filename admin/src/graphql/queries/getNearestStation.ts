import { gql } from '@/__generated__';

export const GET_NEAREST_STATION = gql(`
  query GetNearestStation($latitude: Float!, $longitude: Float!) {
    nearestStation(latitude: $latitude, longitude: $longitude)
  }
`);
