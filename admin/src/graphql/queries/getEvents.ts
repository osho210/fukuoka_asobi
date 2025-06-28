import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      startDatetime
      endDatetime
      location
      isOnline
      recurringRule
      eventCategoryId
      price
      organizer
      contactEmail
      contactPhone
      capacity
      status
      isOnline
      sourceUrl
      bannerImage
      createdAt
      updatedAt
    }
  }
`;
