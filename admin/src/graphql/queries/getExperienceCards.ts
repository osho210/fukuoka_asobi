import { gql } from '@apollo/client';

export const GET_ALL_EXPERIENCE_CARDS = gql`
  query GetAllExperienceCards {
    allExperienceCards {
      id
      title
      body
      tags
      area
      duration
      timeSlot
      active
      createdAt
      updatedAt
    }
  }
`;

export const GET_EXPERIENCE_CARD = gql`
  query GetExperienceCard($id: ID!) {
    experienceCard(id: $id) {
      id
      title
      body
      tags
      area
      duration
      timeSlot
      active
      createdAt
      updatedAt
    }
  }
`;
