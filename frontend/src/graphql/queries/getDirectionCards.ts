import { gql } from '@apollo/client';

export const GET_DIRECTION_CARDS = gql`
  query GetDirectionCards($limit: Int) {
    directionCards(limit: $limit) {
      id
      text
      tags
      weight
      active
    }
  }
`;
