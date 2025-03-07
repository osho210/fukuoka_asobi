import { gql } from '@apollo/client';

export const GET_storeAmbiances = gql`
  query GetStoreAmbiances {
    storeAmbiances {
      id
      ambianceName
    }
  }
`;
