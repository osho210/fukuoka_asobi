import { gql } from '@apollo/client';
export const GET_NEWS_LIST = gql`
  query GetNewsList($categoryId: ID, $limit: Int) {
    news(categoryId: $categoryId, limit: $limit) {
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
    categories {
      id
      name
    }
  }
`;