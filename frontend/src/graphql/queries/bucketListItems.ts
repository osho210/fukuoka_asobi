import { gql } from '@apollo/client';

// バケットリスト企画一覧取得
export const GET_BUCKET_LIST_ITEMS = gql`
  query GetBucketListItems($limit: Int, $offset: Int, $status: String, $weather: String) {
    bucketListItems(limit: $limit, offset: $offset, status: $status, weather: $weather) {
      id
      title
      areaText
      content
      weather
      status
      publishedAt
      costMin
      costMax
      layoutBucket {
        id
        name
        templateKey
        themeKey
        shift
        tilt
        depth
      }
    }
  }
`;

// バケットリスト企画詳細取得
export const GET_BUCKET_LIST_ITEM = gql`
  query GetBucketListItem($id: ID!) {
    bucketListItem(id: $id) {
      id
      title
      content
      areaText
      meetingPlaceName
      meetingPlaceAddress
      meetingPlaceGooglePlaceId
      stayMinutes
      meetingTime
      startTime
      endTime
      costMin
      costMax
      weather
      status
      publishedAt
      layoutBucketId
      layoutBucket {
        id
        name
        templateKey
        themeKey
        shift
        tilt
        depth
      }
      bucketListItemBelongings {
        id
        name
        note
        sortOrder
      }
      bucketListItemReferences {
        id
        title
        url
        referenceType
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;

// ステータスが公開のバケットリスト企画のみ取得
export const GET_PUBLISHED_BUCKET_LIST_ITEMS = gql`
  query GetPublishedBucketListItems($limit: Int, $offset: Int, $weather: String) {
    bucketListItems(limit: $limit, offset: $offset, status: "published", weather: $weather) {
      id
      title
      areaText
      content
      weather
      costMin
      costMax
      publishedAt
      layoutBucket {
        id
        name
        templateKey
        themeKey
        shift
        tilt
        depth
      }
      bucketListItemBelongings {
        id
        name
        sortOrder
      }
    }
  }
`;
