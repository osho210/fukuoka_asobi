import { gql } from '@apollo/client';

export const GET_ENUM_VALUES = gql`
  query GetEnumValues($name: String!) {
    __type(name: $name) {
      name
      enumValues {
        name
        description
      }
    }
  }
`;
