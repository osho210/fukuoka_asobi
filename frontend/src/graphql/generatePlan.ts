import { gql } from '@apollo/client';
import { GeneratePlanMutation, GeneratePlanMutationVariables } from '@/__generated__/types';

// .graphqlファイルからクエリをインポート
export const GENERATE_PLAN = gql`
  mutation GeneratePlan(
    $districts: [ID!]!,
    $date: String!,
    $memberInfo: MemberInfoInput!,
    $budget: BudgetInput!,
    $startTime: String,
    $endTime: String,
    $customOptions: CustomOptionsInput
  ) {
    generatePlan(
      districts: $districts,
      date: $date,
      memberInfo: $memberInfo,
      budget: $budget,
      startTime: $startTime,
      endTime: $endTime,
      customOptions: $customOptions
    ) {
      plan {
        id
        planName
        description
        totalBudget
        startDatetime
        endDatetime
        planDetails {
          id
          stepNumber
          stepName
          stepDescription
          startDatetime
          endDatetime
          budget
          spot {
            id
            spotName
            address
            catchphrase
            imageUrl {
              id
              url
            }
          }
          travelDetails {
            sequenceNumber
            travelMethod
            travelTime
          }
        }
        travelRoute {
          totalDistance
          totalTravelTime
          travelSegments {
            fromSpot {
              id
              spotName
            }
            toSpot {
              id
              spotName
            }
            distance
            travelTime
            travelMethod
          }
        }
      }
      errors
    }
  }
`;

export type { GeneratePlanMutation, GeneratePlanMutationVariables };
