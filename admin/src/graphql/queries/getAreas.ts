import { gql } from '@apollo/client';

export const GET_AREAS = gql`
  query GetAreas {
    areas {
      id
      areaName
      district {
        id
        districtName
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_AREA = gql`
  query GetArea($id: ID!) {
    area(id: $id) {
      id
      areaName
      district {
        id
        districtName
      }
      createdAt
      updatedAt
    }
  }
`;
