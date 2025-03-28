import { gql } from '@apollo/client';
import { GetRecommendedEventsQuery } from '@/__generated__/types';

// .graphqlファイルからクエリをインポート
export const GET_RECOMMENDED_EVENTS = gql`
  query GetRecommendedEvents {
    events(limit: 5, upcoming: true) {
      id
      title
      location
      startDatetime
      endDatetime
      bannerImage
      isOnline
      eventCategory {
        id
        name
      }
    }
  }
`;

export type { GetRecommendedEventsQuery };
