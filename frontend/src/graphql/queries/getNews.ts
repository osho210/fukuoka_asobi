import { gql } from '@apollo/client';

export const GET_NEWS_DETAIL = gql`
  query GetNewsDetail($id: ID!) {
    newsDetail(id: $id) {
      id
      title
      body
      publishedAt
      status
      imageUrl
      category {
        id
        name
      }
      author {
        id
        username
        profileImageUrl
      }
      createdAt
      updatedAt
    }
  }
`;
