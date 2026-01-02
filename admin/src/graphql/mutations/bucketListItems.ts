import { gql } from '@apollo/client';

// バケットリスト企画作成
export const CREATE_BUCKET_LIST_ITEM = gql`
  mutation CreateBucketListItem($input: CreateBucketListItemInput!) {
    createBucketListItem(input: $input) {
      bucketListItem {
        id
        title
        content
        areaText
        meetingPlaceName
        meetingPlaceAddress
        meetingPlaceGooglePlaceId
        startTime
        endTime
        costMin
        costMax
        meetingTime
        stayMinutes
        weather
        status
        publishedAt
        layoutBucketId
        topDisplayFlag
      }
      errors
    }
  }
`;

// バケットリスト企画更新
export const UPDATE_BUCKET_LIST_ITEM = gql`
  mutation UpdateBucketListItem($input: UpdateBucketListItemInput!) {
    updateBucketListItem(input: $input) {
      bucketListItem {
        id
        title
        content
        areaText
        meetingPlaceName
        meetingPlaceAddress
        meetingPlaceGooglePlaceId
        startTime
        endTime
        costMin
        costMax
        meetingTime
        stayMinutes
        weather
        status
        publishedAt
        layoutBucketId
        topDisplayFlag
      }
      errors
    }
  }
`;
