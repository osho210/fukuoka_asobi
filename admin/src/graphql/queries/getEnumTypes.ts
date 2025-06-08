import { gql } from '@apollo/client';

export const GET_SPOT_TYPE_ENUM = gql`
  query GetSpotTypeEnum {
    __type(name: "SpotTypeEnum") {
      enumValues {
        name
        description
      }
    }
  }
`;

export const GET_BUDGET_RANGE_ENUM = gql`
  query GetBudgetRangeEnum {
    __type(name: "BudgetTypeRangeEnum") {
      enumValues {
        name
        description
      }
    }
  }
`;
