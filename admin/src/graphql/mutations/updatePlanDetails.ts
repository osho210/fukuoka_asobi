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
        startTime
        endTime
        durationMinutes
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
mutation CreateOrUpdatePlayPlanWithDetails($input: CreateOrUpdatePlayPlanWithDetailsInput!) {
  createOrUpdatePlayPlanWithDetails(input: $input) {
    playPlan {
      id
      planName
      description
      status
      tripType
      totalBudget
      location
      startTime
      endTime
      imageUrl
      plannerTitle
      plannerDescription
      imageUrls {
        id
        url
      }
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
      planDetails {
        id
        stepNumber
        stepName
        stepDescription
        startTime
        endTime
        durationMinutes
        budget
        comment
        notes
        spot {
          id
          spotName
        }
        travelDetails {
          id
          sequenceNumber
          travelMethod
          travelTime
          notes
        }
      }
    }
    errors {
      field
      message
    }
    success
  }
}
`;
