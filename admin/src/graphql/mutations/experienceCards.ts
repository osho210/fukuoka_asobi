import { gql } from '@apollo/client';

export const CREATE_EXPERIENCE_CARD = gql`
  mutation CreateExperienceCard($input: CreateExperienceCardInput!) {
    createExperienceCard(input: $input) {
      experienceCard {
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
      errors
    }
  }
`;

export const UPDATE_EXPERIENCE_CARD = gql`
  mutation UpdateExperienceCard($input: UpdateExperienceCardInput!) {
    updateExperienceCard(input: $input) {
      experienceCard {
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
      errors
    }
  }
`;

export const DELETE_EXPERIENCE_CARD = gql`
  mutation DeleteExperienceCard($input: DeleteExperienceCardInput!) {
    deleteExperienceCard(input: $input) {
      success
      errors
    }
  }
`;
