import { gql } from '@apollo/client';

export const GET_ALL_DIRECTION_CARDS = gql`
  query GetAllDirectionCards {
    allDirectionCards {
      id
      text
      tags
      weight
      active
      createdAt
      updatedAt
    }
  }
`;

export const GET_DIRECTION_CARD = gql`
  query GetDirectionCard($id: ID!) {
    directionCard(id: $id) {
      id
      text
      tags
      weight
      active
      createdAt
      updatedAt
    }
  }
`;
