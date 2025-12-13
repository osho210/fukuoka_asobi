import { gql } from '@apollo/client';

export const USER_LOGOUT = gql`
  mutation UserLogout {
    userLogout {
      success
      errors
    }
  }
`;
