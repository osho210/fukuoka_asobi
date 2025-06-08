import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents($limit: Int) {
    events(limit: $limit) {
      id
      title
      description
      location
      startDatetime
      endDatetime
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      description
      location
      latitude
      longitude
      startDatetime
      endDatetime
      recurringRule
      price
      organizer
      contactEmail
      contactPhone
      capacity
      isOnline
      sourceUrl
      bannerImage
      status
      eventCategory {
        id
        name
        description
      }
      eventCategoryId
      createdAt
      updatedAt
    }
  }
`;
