// 注意: 現在のバックエンドAPIでは、スポットのミューテーションは提供されていません。
// 将来的にバックエンドAPIが拡張された場合に備えて、以下のようなミューテーションを定義しておきます。

import { gql } from '@apollo/client';

// ダミーのミューテーションを定義して、インポートエラーを回避
export const CREATE_SPOT = gql`
  mutation CreateSpot($spotName: String!, $districtId: ID!) {
    __typename
  }
`;

export const UPDATE_SPOT = gql`
  mutation UpdateSpot($id: ID!, $spotName: String) {
    __typename
  }
`;

export const DELETE_SPOT = gql`
  mutation DeleteSpot($id: ID!) {
    __typename
  }
`;

export const ADD_SPOT_AREA = gql`
  mutation AddSpotArea($spotId: ID!, $areaId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_AREA = gql`
  mutation RemoveSpotArea($spotId: ID!, $areaId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_CATEGORY = gql`
  mutation AddSpotCategory($spotId: ID!, $categoryId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_CATEGORY = gql`
  mutation RemoveSpotCategory($spotId: ID!, $categoryId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_HASHTAG = gql`
  mutation AddSpotHashtag($spotId: ID!, $hashtagId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_HASHTAG = gql`
  mutation RemoveSpotHashtag($spotId: ID!, $hashtagId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_MENU = gql`
  mutation AddSpotMenu($spotId: ID!, $menuId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_MENU = gql`
  mutation RemoveSpotMenu($spotId: ID!, $menuId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_PURPOSE = gql`
  mutation AddSpotPurpose($spotId: ID!, $purposeId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_PURPOSE = gql`
  mutation RemoveSpotPurpose($spotId: ID!, $purposeId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_AMBIANCE = gql`
  mutation AddSpotAmbiance($spotId: ID!, $ambianceId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_AMBIANCE = gql`
  mutation RemoveSpotAmbiance($spotId: ID!, $ambianceId: ID!) {
    __typename
  }
`;
