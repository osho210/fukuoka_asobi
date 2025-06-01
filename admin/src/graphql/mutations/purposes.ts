import { gql } from '@apollo/client';

export const CREATE_PURPOSE = gql`
  mutation CreatePurpose($input: CreatePurposeInput!) {
    createPurpose(input: $input) {
      purpose {
        id
        purposeName
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_PURPOSE = gql`
  mutation UpdatePurpose($input: UpdatePurposeInput!) {
    updatePurpose(input: $input) {
      purpose {
        id
        purposeName
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_PURPOSE = gql`
  mutation DeletePurpose($input: DeletePurposeInput!) {
    deletePurpose(input: $input) {
      success
      errors
    }
  }
`;
