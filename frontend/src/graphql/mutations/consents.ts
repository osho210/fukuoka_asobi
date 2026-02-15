import { gql } from '@apollo/client';

export const CREATE_CONSENT_AGREEMENT = gql`
  mutation CreateConsentAgreement($input: CreateConsentAgreementInput!) {
    createConsentAgreement(input: $input) {
      consentAgreement {
        id
        agreedAt
      }
      errors
    }
  }
`;
