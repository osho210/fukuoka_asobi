import { gql } from '@apollo/client';

export const GET_CONSENT_REQUESTS = gql`
  query GetConsentRequests($spotId: ID, $status: ConsentRequestStatusEnum) {
    consentRequests(spotId: $spotId, status: $status) {
      id
      spotId
      consenterType
      consenterDisplayName
      contactHint
      status
      token
      expiresAt
      messageTemplate
      createdBy
      createdAt
      updatedAt
      formUrl
      spot {
        id
        spotName
      }
      consentAgreement {
        id
        signerName
        agreedAt
      }
    }
  }
`;

export const GET_CONSENT_REQUEST = gql`
  query GetConsentRequest($id: ID, $token: String) {
    consentRequest(id: $id, token: $token) {
      id
      spotId
      consenterType
      consenterDisplayName
      contactHint
      status
      token
      expiresAt
      messageTemplate
      createdBy
      createdAt
      updatedAt
      formUrl
      spot {
        id
        spotName
        address
      }
      consentAgreement {
        id
        agreedAt
        agreementVersion
        agreementSnapshotJson
        signerName
        signerInstagram
        photographerName
        tagStoreRequested
        tagPhotographerRequested
        tagAccountsText
        rightsConfirmed
        createdAt
      }
    }
  }
`;

export const GET_LICENSED_ASSETS = gql`
  query GetLicensedAssets($spotId: ID, $usable: Boolean) {
    licensedAssets(spotId: $spotId, usable: $usable) {
      id
      spotId
      consentAgreementId
      assetType
      assetUrl
      sourceUrl
      captionNote
      usable
      createdAt
      updatedAt
      imageUrl
      spot {
        id
        spotName
      }
      consentAgreement {
        id
        signerName
        photographerName
        tagStoreRequested
        tagPhotographerRequested
        tagAccountsText
        agreedAt
      }
    }
  }
`;
