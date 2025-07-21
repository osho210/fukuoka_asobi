import { gql } from '@apollo/client';

export const GET_MENU_CATEGORIES = gql`
  query GetMenuCategories {
    menuCategories {
      id
      name
    }
  }
`;
