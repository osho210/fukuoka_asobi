import { gql } from '@apollo/client';

export const GET_BUCKET_LIST_ITEMS = gql`
  query GetBucketListItems {
    bucketListItems {
      id
      layoutBucket {
        id
        name
      }
      layoutBucketId
      topDisplayFlag
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
      bucketListItemBelongings {
        id
      }
      bucketListItemReferences {
        id
      }
      createdAt
      updatedAt
    }
  }
`;
