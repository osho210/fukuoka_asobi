import { gql } from '@apollo/client';

export const GET_EXPERIENCE_CARDS = gql`
  query GetExperienceCards($tags: [String!], $limit: Int, $excludeIds: [ID!]) {
    experienceCards(tags: $tags, limit: $limit, excludeIds: $excludeIds) {
      id
      title
      body
      truncatedBody(length: 100)
      tags
      area
      duration
      timeSlot
      active
    }
  }
`;
