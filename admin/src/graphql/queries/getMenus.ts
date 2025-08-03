import { gql } from '@apollo/client';

// 現在はメニュー情報のみを保持するで良いが、将来的には店舗ごとのメニューもDBで管理する可能性があるため、
// 中間テーブルで保持する項目を増やすかもしれない
export const GET_MENUS = gql`
  query GetMenus {
    menus {
      id
      menuName
      price
      description
      imageUrl{
        id
        url
      }
      menuCategory {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;
