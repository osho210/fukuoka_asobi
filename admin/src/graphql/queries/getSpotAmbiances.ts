import { gql } from '@apollo/client';

export const GET_SPOT_AMBIANCES = gql`
  query GetSpotAmbiances {
    spotAmbiances {
      id
      ambianceName
      createdAt
      updatedAt
    }
  }
`;
