import { gql } from '@apollo/client';

export const GET_SEO_INDEX_LIST = gql`
  query GetSeoIndexList($type: String, $isIndexable: Boolean, $status: StatusEnum) {
    seoIndexList(type: $type, isIndexable: $isIndexable, status: $status) {
      id
      title
      type
      status
      isIndexable
      url
      updatedAt
      googleIndexStatus {
        id
        inspectedUrl
        coverageState
        crawledAs
        indexingAllowed
        lastCrawlTime
        verdict
        googleCanonical
        userCanonical
        indexed
        crawled
        indexable
        notIndexedReason
        hasMismatch
        statusColor
        updatedAt
      }
    }
  }
`;
