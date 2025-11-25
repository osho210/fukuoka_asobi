import { gql } from '@apollo/client';

export const GET_CURRENT_SUBSCRIPTION = gql`
  query GetCurrentSubscription {
    currentSubscription {
      id
      status
      currentPeriodEnd
      cancelAtPeriodEnd
      canceledAt
    }
  }
`;

export const GET_PAYMENT_HISTORY = gql`
  query GetPaymentHistory($limit: Int) {
    paymentHistory(limit: $limit) {
      id
      amount
      currency
      status
      paidAt
      createdAt
    }
  }
`;

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($successUrl: String!, $cancelUrl: String!) {
    createSubscription(input: { successUrl: $successUrl, cancelUrl: $cancelUrl }) {
      sessionId
      errors
    }
  }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription($immediately: Boolean) {
    cancelSubscription(input: { immediately: $immediately }) {
      success
      message
      errors
    }
  }
`;

// Re-export types from generated GraphQL types
// Note: Run `npm run codegen` to generate these types
export type {
  GetCurrentSubscriptionQuery,
  GetPaymentHistoryQuery,
  GetPaymentHistoryQueryVariables,
  CreateSubscriptionMutation,
  CreateSubscriptionMutationVariables,
  CancelSubscriptionMutation,
  CancelSubscriptionMutationVariables,
} from '@/__generated__/types';
