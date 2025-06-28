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

export const GET_TRAIN_LINE_ENUM = gql`
  query GetTrainLineEnum {
    __type(name: "TrainLineEnum") {
      enumValues {
        name
        description
      }
    }
  }
`

export const GET_STATUS_ENUM = gql`
  query GetStatusEnum {
    __type(name: "StatusEnum") {
      enumValues {
        name
        description
      }
    }
  }
`;

export const GET_TRIP_TYPE_ENUM = gql`
  query GetTripTypeEnum {
    __type(name: "TripTypeEnum") {
      enumValues {
        name
        description
      }
    }
  }
`;

