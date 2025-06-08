// 注意: 現在のバックエンドAPIでは、メニューのミューテーションは提供されていません。
// 将来的にバックエンドAPIが拡張された場合に備えて、以下のようなミューテーションを定義しておきます。

import { gql } from '@apollo/client';

// ダミーのミューテーションを定義して、インポートエラーを回避
export const CREATE_MENU = gql`
  mutation CreateMenu($menuName: String!) {
    __typename
  }
`;

export const UPDATE_MENU = gql`
  mutation UpdateMenu($id: ID!, $menuName: String) {
    __typename
  }
`;

export const DELETE_MENU = gql`
  mutation DeleteMenu($id: ID!) {
    __typename
  }
`;
