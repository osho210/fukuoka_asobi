import { gql } from '@apollo/client';

// export const CREATE_EVENT = gql`
//   mutation CreateEvent(
//     $input: CreateEventInput!
//   ) {
//     createEvent(
//       input: $input
//     ) {
//       event {
//         id
//         eventName
//         description
//         startDate
//         endDate
//         location
//         isOnline
//         maxParticipants
//         minParticipants
//         createdAt
//         updatedAt
//       }
//       errors
//     }
//   }
// `;

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