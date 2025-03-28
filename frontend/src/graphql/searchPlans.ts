import { gql } from '@apollo/client';
import { SearchPlansQuery, SearchPlansQueryVariables } from '@/__generated__/types';

// .graphqlファイルからクエリをインポート
export const SEARCH_PLANS = gql`
  query searchPlans($areas: [ID!], $date: String!, $genderInfo: GenderInput!, $budget: BudgetInput!, $customOptions: CustomOptionsInput) {
    searchPlans(
      areas: $areas
      date: $date
      genderInfo: $genderInfo
      budget: $budget
      customOptions: $customOptions
    ) {
      id
      planName
      description
      imageUrl
      location
      totalBudget
      rating
      reviewCount
      tripType
      planDetails {
        id
        stepName
        stepDescription
        spot {
          id
          spotName
          address
          catchphrase
        }
      }
    }
  }
`;

export type { SearchPlansQuery, SearchPlansQueryVariables };
