import { gql } from '@apollo/client';

export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $input: CreateEventInput!
  ) {
    createEvent(
      input: $input
    ) {
      event {
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
      }
      errors
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      event {
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
      }
      errors
    }
  }
`;