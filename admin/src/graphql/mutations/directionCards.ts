import { gql } from '@apollo/client';

export const CREATE_DIRECTION_CARD = gql`
  mutation CreateDirectionCard($input: CreateDirectionCardInput!) {
    createDirectionCard(input: $input) {
      directionCard {
        id
        text
        tags
        weight
        active
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_DIRECTION_CARD = gql`
  mutation UpdateDirectionCard($input: UpdateDirectionCardInput!) {
    updateDirectionCard(input: $input) {
      directionCard {
        id
        text
        tags
        weight
        active
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_DIRECTION_CARD = gql`
  mutation DeleteDirectionCard($input: DeleteDirectionCardInput!) {
    deleteDirectionCard(input: $input) {
      success
      errors
    }
  }
`;
