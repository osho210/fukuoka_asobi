import { gql } from '@apollo/client';

export const GET_DISTRICTS = gql`
  query GetDistricts {
    districts {
      id
      districtName
    }
  }
`;
