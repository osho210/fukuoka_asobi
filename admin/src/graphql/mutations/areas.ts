import { gql } from '@apollo/client';

export const CREATE_AREA = gql`
  mutation CreateArea($input: CreateAreaInput!) {
    createArea(input: $input) {
      area {
        id
        areaName
        district {
          id
          districtName
        }
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_AREA = gql`
  mutation UpdateArea($input: UpdateAreaInput!) {
    updateArea(input: $input) {
      area {
        id
        areaName
        district {
          id
          districtName
        }
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const DELETE_AREA = gql`
  mutation DeleteArea($input: DeleteAreaInput!) {
    deleteArea(input: $input) {
      success
      errors
    }
  }
`;
