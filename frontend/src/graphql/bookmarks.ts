import { gql } from '@apollo/client';

// .graphqlファイルからクエリをインポート
export const GET_USER_BOOKMARKS = gql`
  query GetUserBookmarks($limit: Int, $bookmarkableType: String, $category: String) {
    userBookmarks(limit: $limit, bookmarkableType: $bookmarkableType, category: $category) {
      id
      bookmarkableType
      bookmarkableId
      title
      note
      category
      createdAt
      bookmarkable {
        ... on PlayPlan {
          id
          planName
          description
          imageUrl
          status
        }
      }
    }
  }
`;

export const CREATE_BOOKMARK = gql`
  mutation CreateBookmark($bookmarkableType: String!, $bookmarkableId: ID!, $title: String, $note: String, $category: String) {
    createBookmark(input: { bookmarkableType: $bookmarkableType, bookmarkableId: $bookmarkableId, title: $title, note: $note, category: $category }) {
      bookmark {
        id
        bookmarkableType
        bookmarkableId
        title
        note
        category
      }
      errors
    }
  }
`;

export const UPDATE_BOOKMARK = gql`
  mutation UpdateBookmark($id: ID!, $title: String, $note: String, $category: String) {
    updateBookmark(input: { id: $id, title: $title, note: $note, category: $category }) {
      bookmark {
        id
        title
        note
        category
      }
      errors
    }
  }
`;

export const DELETE_BOOKMARK = gql`
  mutation DeleteBookmark($id: ID!) {
    deleteBookmark(input: { id: $id }) {
      success
      errors
    }
  }
`;
