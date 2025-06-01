import { gql } from '@apollo/client';

export const GET_DISTRICTS = gql`
  query GetDistricts {
    districts {
      id
      districtName
      createdAt
      updatedAt
    }
  }
`;

export const GET_DISTRICT = gql`
  query GetDistrict($id: ID!) {
    district(id: $id) {
      id
      districtName
      createdAt
      updatedAt
    }
  }
`;
