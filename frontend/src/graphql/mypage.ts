import { gql } from '@apollo/client';

// .graphqlファイルからクエリをインポート
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      username
      email
      profileImageUrl
      bio
      instagramUrl
      isPaidMember
      paidStartDate
      paidEndDate
      avatarUrl
    }
  }
`;

export const GET_USER_PLAY_PLANS = gql`
  query GetUserPlayPlans($limit: Int) {
    userPlayPlans(limit: $limit) {
      id
      planName
      description
      imageUrl
      status
      createdAt
      totalBudget
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($username: String, $instagramUrl: String, $bio: String, $profileImageUrl: String, $avatar: String) {
    updateUserProfile(input: { username: $username, instagramUrl: $instagramUrl, bio: $bio, profileImageUrl: $profileImageUrl, avatar: $avatar }) {
      user {
        id
        username
        instagramUrl
        bio
        profileImageUrl
        avatarUrl
      }
      errors
    }
  }
`;

// Re-export types from generated GraphQL types
export type {
  GetCurrentUserQuery,
  GetUserPlayPlansQuery,
  GetUserPlayPlansQueryVariables,
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables,
} from '@/__generated__/types';
