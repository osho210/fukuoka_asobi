import { gql } from '@apollo/client';

export const CREATE_CONSENT_REQUEST = gql`
  mutation CreateConsentRequest($input: CreateConsentRequestInput!) {
    createConsentRequest(input: $input) {
      consentRequest {
        id
        spotId
        consenterType
        consenterDisplayName
        contactHint
        instagramPostUrl
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
      }
      errors
    }
  }
`;

export const UPDATE_CONSENT_REQUEST_STATUS = gql`
  mutation UpdateConsentRequestStatus($input: UpdateConsentRequestStatusInput!) {
    updateConsentRequestStatus(input: $input) {
      consentRequest {
        id
        status
      }
      errors
    }
  }
`;

export const CREATE_CONSENT_AGREEMENT = gql`
  mutation CreateConsentAgreement($input: CreateConsentAgreementInput!) {
    createConsentAgreement(input: $input) {
      consentAgreement {
        id
        consentRequestId
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
        ipAddress
        userAgent
        createdAt
      }
      errors
    }
  }
`;

export const CREATE_LICENSED_ASSET = gql`
  mutation CreateLicensedAsset($input: CreateLicensedAssetInput!) {
    createLicensedAsset(input: $input) {
      licensedAsset {
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
        }
      }
      errors
    }
  }
`;

export const UPDATE_LICENSED_ASSET = gql`
  mutation UpdateLicensedAsset($input: UpdateLicensedAssetInput!) {
    updateLicensedAsset(input: $input) {
      licensedAsset {
        id
        usable
        captionNote
      }
      errors
    }
  }
`;
