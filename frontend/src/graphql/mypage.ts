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
  mutation UpdateUserProfile($username: String, $instagramUrl: String, $bio: String, $profileImageUrl: String) {
    updateUserProfile(input: { username: $username, instagramUrl: $instagramUrl, bio: $bio, profileImageUrl: $profileImageUrl }) {
      user {
        id
        username
        instagramUrl
        bio
        profileImageUrl
      }
      errors
    }
  }
`;
