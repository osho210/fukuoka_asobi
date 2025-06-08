import { gql } from '@apollo/client';

export const CREATE_DISTRICT = gql`
  mutation CreateDistrict($input: CreateDistrictInput!) {
    createDistrict(input: $input) {
      district {
        id
        districtName
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_DISTRICT = gql`
  mutation UpdateDistrict($input: UpdateDistrictInput!) {
    updateDistrict(input: $input) {
      district {
        id
        districtName
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_DISTRICT = gql`
  mutation DeleteDistrict($input: DeleteDistrictInput!) {
    deleteDistrict(input: $input) {
      success
      errors
    }
  }
`;
