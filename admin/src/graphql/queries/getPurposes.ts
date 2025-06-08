import { gql } from '@apollo/client';

export const GET_PURPOSES = gql`
  query GetPurposes {
    purposes {
      id
      purposeName
      createdAt
      updatedAt
    }
  }
`;