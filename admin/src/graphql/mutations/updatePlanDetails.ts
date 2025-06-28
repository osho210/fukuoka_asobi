import { gql } from '@apollo/client';

export const UPDATE_PLAN_DETAILS = gql`
  mutation UpdatePlanDetails($input:UpdatePlanDetailsInput!) {
    updatePlanDetails(input: $input) {
      planDetails {
        id
        planId
        stepNumber
        stepName
        stepDescription
        startDatetime
        endDatetime
        budget
        comment
        notes
        spot {
          id
          spotName
        }
      }
      errors
    }
  }
`;

export const UPDATE_PLAY_PLAN_WITH_DETAILS = gql`
  mutation UpdatePlayPlanWithDetails($input: UpdatePlayPlanInput!) {
    updatePlayPlan(input: $input) {
      playPlan {
        id
        planName
        description
        status
        tripType
        totalBudget
        location
        startDatetime
        endDatetime
        imageUrl
        tags
        favoriteCount
        publishedAt
        plannerDescription
        rating
        reviewCount
        recommendedFors {
          id
          name
        }
      }
      planDetails {
        planId
        stepNumber
        stepName
        stepDescription
        startDatetime
        endDatetime
        budget
        comment
        notes
        spot {
          id
          spotName
        }
      }
      errors
    }
  }
`;
