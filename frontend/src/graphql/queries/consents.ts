import { gql } from '@apollo/client';

export const GET_CONSENT_REQUEST_BY_TOKEN = gql`
  query GetConsentRequestByToken($token: String!) {
    consentRequest(token: $token) {
      id
      spotId
      consenterType
      consenterDisplayName
      status
      expiresAt
      spot {
        id
        spotName
        address
      }
    }
  }
`;
