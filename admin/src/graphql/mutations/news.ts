import { gql } from '@apollo/client';

export const CREATE_NEWS = gql`
  mutation CreateNews($input: CreateNewsInput!) {
    createNews(input: $input) {
      news {
        title
        body
        publishedAt
        status
        imageUrl
        author {
            id
            username
        }
        category {
            id
            name
        }
      }
      errors
    }
  }
`;

export const UPDATE_NEWS = gql`
  mutation UpdateNews($input: UpdateNewsInput!) {
    updateNews(input: $input) {
      news {
        id
        title
        body
        publishedAt
        status
        imageUrl
        author {
            id
            username
        }
        category {
            id
            name
        }
      }
      errors
    }
  }
`;