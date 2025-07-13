import { gql } from '@apollo/client';

export const CREATE_SPOT = gql`
  mutation CreateSpot(
    $input: CreateSpotInput!
  ) {
    createSpot(
      input: $input
    ) {
      spot {
        id
        spotName
        address
        district {
          id
          districtName
        }
        districtId
        phoneNumber
        website
        catchphrase
        isRainyOk
        budgetRange
        spotType
        theme
        reviewRating
        reviewCount
        instagramUrl
        isClosed
        maxPeople
        minPeople
        recommendedFor1
        recommendedFor2
        imageUrl
        nearestStation
        parkingAvailable
        googlePlaceId
        latitude
        longitude
        businessStatus
        priceLevel
        primaryType
        primaryTypeDisplayName
        internationalPhoneNumber
        shortFormattedAddress
        googleMapsUri
        takeout
        delivery
        dineIn
        reservable
        servesBreakfast
        servesLunch
        servesDinner
        servesBrunch
        servesBeer
        servesWine
        servesVegetarianFood
        outdoorSeating
        liveMusic
        menuForChildren
        servesCocktails
        servesDessert
        servesCoffee
        goodForChildren
        allowsDogs
        restroom
        goodForGroups
        goodForWatchingSports
        # acceptsCreditCards
        # acceptsDebitCards
        # acceptsCashOnly
        # acceptsNfc
        # freeParkingLot
        # paidParkingLot
        # freeStreetParking
        # paidStreetParking
        # valetParking
        # freeGarageParking
        # paidGarageParking
        openingHours {
          id
          dayOfWeek
          openTime
          closeTime
          isClosedDay
        }
        hashtags {
          id
          hashtagName
        }
        purposes {
          id
          purposeName
        }
        spotAmbiances {
          id
          ambianceName
        }
        categories {
          id
          name
        }
        menus {
          id
          menuName
        }
        areas {
          id
          areaName
        }
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_SPOT = gql`
  mutation UpdateSpot($input: UpdateSpotInput!) {
    updateSpot(input: $input) {
      spot {
        id
        spotName
        address
        district {
          id
          districtName
        }
        districtId
        phoneNumber
        website
        catchphrase
        isRainyOk
        budgetRange
        spotType
        theme
        reviewRating
        reviewCount
        instagramUrl
        isClosed
        maxPeople
        minPeople
        recommendedFor1
        recommendedFor2
        imageUrl
        nearestStation
        parkingAvailable
        googlePlaceId
        latitude
        longitude
        businessStatus
        priceLevel
        primaryType
        primaryTypeDisplayName
        internationalPhoneNumber
        shortFormattedAddress
        googleMapsUri
        takeout
        delivery
        dineIn
        reservable
        servesBreakfast
        servesLunch
        servesDinner
        servesBrunch
        servesBeer
        servesWine
        servesVegetarianFood
        outdoorSeating
        liveMusic
        menuForChildren
        servesCocktails
        servesDessert
        servesCoffee
        goodForChildren
        allowsDogs
        restroom
        goodForGroups
        goodForWatchingSports
        # acceptsCreditCards
        # acceptsDebitCards
        # acceptsCashOnly
        # acceptsNfc
        # freeParkingLot
        # paidParkingLot
        # freeStreetParking
        # paidStreetParking
        # valetParking
        # freeGarageParking
        # paidGarageParking
        openingHours {
          id
          dayOfWeek
          openTime
          closeTime
          isClosedDay
        }
        hashtags {
          id
          hashtagName
        }
        purposes {
          id
          purposeName
        }
        spotAmbiances {
          id
          ambianceName
        }
        categories {
          id
          name
        }
        menus {
          id
          menuName
        }
        areas {
          id
          areaName
        }
      }
      errors
    }
  }
`;


export const DELETE_SPOT = gql`
  mutation DeleteSpot($id: ID!) {
    deleteSpot(input: { id: $id }) {
      success
      errors
    }
  }
`;

export const ADD_SPOT_AREA = gql`
  mutation AddSpotArea($spotId: ID!, $areaId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_AREA = gql`
  mutation RemoveSpotArea($spotId: ID!, $areaId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_CATEGORY = gql`
  mutation AddSpotCategory($spotId: ID!, $categoryId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_CATEGORY = gql`
  mutation RemoveSpotCategory($spotId: ID!, $categoryId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_HASHTAG = gql`
  mutation AddSpotHashtag($spotId: ID!, $hashtagId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_HASHTAG = gql`
  mutation RemoveSpotHashtag($spotId: ID!, $hashtagId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_MENU = gql`
  mutation AddSpotMenu($spotId: ID!, $menuId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_MENU = gql`
  mutation RemoveSpotMenu($spotId: ID!, $menuId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_PURPOSE = gql`
  mutation AddSpotPurpose($spotId: ID!, $purposeId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_PURPOSE = gql`
  mutation RemoveSpotPurpose($spotId: ID!, $purposeId: ID!) {
    __typename
  }
`;

export const ADD_SPOT_AMBIANCE = gql`
  mutation AddSpotAmbiance($spotId: ID!, $ambianceId: ID!) {
    __typename
  }
`;

export const REMOVE_SPOT_AMBIANCE = gql`
  mutation RemoveSpotAmbiance($spotId: ID!, $ambianceId: ID!) {
    __typename
  }
`;
