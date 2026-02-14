import { gql } from '@apollo/client';

export const CREATE_CONSENT_REQUEST = gql`
  mutation CreateConsentRequest($input: ConsentRequestInput!) {
    createConsentRequest(input: $input) {
      consentRequest {
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
      }
      errors
    }
  }
`;

export const UPDATE_CONSENT_REQUEST_STATUS = gql`
  mutation UpdateConsentRequestStatus($id: ID!, $status: ConsentRequestStatusEnum!) {
    updateConsentRequestStatus(id: $id, status: $status) {
      consentRequest {
        id
        status
      }
      errors
    }
  }
`;

export const CREATE_CONSENT_AGREEMENT = gql`
  mutation CreateConsentAgreement($input: ConsentAgreementInput!) {
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
  mutation CreateLicensedAsset($input: LicensedAssetInput!) {
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
  mutation UpdateLicensedAsset($id: ID!, $usable: Boolean, $captionNote: String) {
    updateLicensedAsset(id: $id, usable: $usable, captionNote: $captionNote) {
      licensedAsset {
        id
        usable
        captionNote
      }
      errors
    }
  }
`;
