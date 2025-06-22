import { gql } from '@apollo/client';

export const GET_EVENT_CATEGORIES = gql`
    query GetEventCategories {
        eventCategories {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`;