import { gql } from '@apollo/client';

export const CREATE_CONSENT_AGREEMENT = gql`
  mutation CreateConsentAgreement(
    $token: String!
    $signerName: String!
    $rightsConfirmed: Boolean!
    $signerInstagram: String
    $photographerName: String
    $tagStoreRequested: Boolean
    $tagPhotographerRequested: Boolean
    $tagAccountsText: String
    $ipAddress: String
    $userAgent: String
  ) {
    createConsentAgreement(
      token: $token
      signerName: $signerName
      rightsConfirmed: $rightsConfirmed
      signerInstagram: $signerInstagram
      photographerName: $photographerName
      tagStoreRequested: $tagStoreRequested
      tagPhotographerRequested: $tagPhotographerRequested
      tagAccountsText: $tagAccountsText
      ipAddress: $ipAddress
      userAgent: $userAgent
    ) {
      consentAgreement {
        id
        agreedAt
      }
      errors
    }
  }
`;
