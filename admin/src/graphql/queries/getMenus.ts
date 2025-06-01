// 注意: 現在のバックエンドAPIでは、メニューのクエリは提供されていません。
// 将来的にバックエンドAPIが拡張された場合に備えて、以下のようなクエリを定義しておきます。

import { gql } from '@apollo/client';

// ダミーのクエリを定義して、インポートエラーを回避
export const GET_MENUS = gql`
  query GetMenus {
    __typename
  }
`;

export const GET_MENU = gql`
  query GetMenu($id: ID!) {
    __typename
  }
`;
