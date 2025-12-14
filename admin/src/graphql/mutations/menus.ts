import { gql } from '@apollo/client';

export const CREATE_MENU = gql`
  mutation CreateMenu($input: CreateMenuInput!) {
    createMenu(input: $input) {
      menu {
        id
        menuName
        price
        description
        imageUrl {
          id
          url
        }
        menuCategory {
          id
          name
        }
      }
      errors
    }
  }
`;

export const UPDATE_MENU = gql`
  mutation UpdateMenu($input: UpdateMenuInput!) {
    updateMenu(input: $input) {
      menu {
        id
        menuName
        price
        description
        imageUrl {
          id
          url
        }
        menuCategory {
          id
          name
        }
      }
      errors
    }
  }
`;

export const DELETE_MENU = gql`
  mutation DeleteMenu($input: DeleteMenuInput!) {
    deleteMenu(input: $input) {
      errors
    }
  }
`;
