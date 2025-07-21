import { gql } from '@apollo/client';

export const CREATE_MAGAZINE = gql`
  mutation CreateMagazine($input: CreateMagazineInput!) {
    createMagazine(input: $input) {
      magazine {
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
      errors
    }
  }
`;

export const UPDATE_MAGAZINE = gql`
  mutation UpdateMagazine($input: UpdateMagazineInput!) {
    updateMagazine(input: $input) {
      magazine {
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
      errors
    }
  }
`;

