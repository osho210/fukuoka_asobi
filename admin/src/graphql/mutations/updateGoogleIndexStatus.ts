import { gql } from '@apollo/client';

export const UPDATE_GOOGLE_INDEX_STATUS = gql`
  mutation UpdateGoogleIndexStatus(
    $indexableType: String!
    $indexableId: ID!
    $siteUrl: String
  ) {
    updateGoogleIndexStatus(
      indexableType: $indexableType
      indexableId: $indexableId
      siteUrl: $siteUrl
    ) {
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
      errors
    }
  }
`;
