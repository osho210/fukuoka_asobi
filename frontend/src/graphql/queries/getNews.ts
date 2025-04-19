import { gql } from '@apollo/client';

export const GET_NEWS = gql`
  query GetNews($id: ID!) {
    news(id: $id) {
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
