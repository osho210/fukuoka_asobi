// 注意: 現在のバックエンドAPIでは、メニューのミューテーションは提供されていません。
// 将来的にバックエンドAPIが拡張された場合に備えて、以下のようなミューテーションを定義しておきます。

import { gql } from '@apollo/client';

// ダミーのミューテーションを定義して、インポートエラーを回避
export const CREATE_MENU = gql`
  mutation CreateMenu($input: CreateMenuInput!) {
    createMenu(input: $input) {
      menu {
        menuName
        imageFilename
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
        imageFilename
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
