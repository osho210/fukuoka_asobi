import { gql } from '@apollo/client';

export const USER_LOGOUT = gql`
  mutation UserLogout($input: UserLogoutInput!) {
    userLogout(input: $input) {
      success
      errors
    }
  }
`;
