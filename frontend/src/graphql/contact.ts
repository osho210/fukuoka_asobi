import { gql } from '@apollo/client';

// お問い合わせメール送信ミューテーション
export const SEND_CONTACT_MESSAGE = gql`
  mutation SendContactMessage(
    $name: String!
    $email: String!
    $subject: String!
    $category: String!
    $message: String!
    $privacyAccepted: Boolean!
  ) {
    sendContactMessage(
      input: {
        name: $name
        email: $email
        subject: $subject
        category: $category
        message: $message
        privacyAccepted: $privacyAccepted
      }
    ) {
      success
      errors
    }
  }
`;

// Re-export types from generated GraphQL types
export type {
  SendContactMessageMutation,
  SendContactMessageMutationVariables,
} from '@/__generated__/types';
