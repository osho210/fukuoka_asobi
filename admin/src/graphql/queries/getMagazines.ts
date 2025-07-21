import { gql } from '@apollo/client';

export const GET_MAGAZINES = gql`
  query GetMagazines {
    magazines {
      id
      name
      releaseDate
      salesInfo
      salesUrl
      publisher
      issueNumber
      coverImageUrl
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_MAGAZINE = gql`
  query GetMagazine($id: ID!) {
    magazine(id: $id) {
      id
      name
      releaseDate
      salesInfo
      salesUrl
      publisher
      issueNumber
      coverImageUrl
      description
      status
      createdAt
      updatedAt
    }
  }
`;
