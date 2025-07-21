import { gql } from '@apollo/client';

export const GET_SPOTS = gql`
  query GetSpots {
    spots {
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
        acceptsCreditCards
        acceptsDebitCards
        acceptsCashOnly
        acceptsNfc
        freeParkingLot
        paidParkingLot
        freeStreetParking
        paidStreetParking
        valetParking
        freeGarageParking
        paidGarageParking
        googleTypes,
        adrFormatAddress,
        generativeSummary,
        editorialSummary,
        priceRangeStartAmount,
        priceRangeEndAmount,
        priceRange {
          startPrice {
            amount
            currency
          }
          endPrice {
            amount
            currency
          }
        }
        reviewSummary {
          text
          flagContentUri
          disclosureText
          reviewsUri
        }
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
        magazines {
          id
          name
          releaseDate
          salesInfo
          salesUrl
          publisher
          issueNumber
          coverImageUrl
          description
          status
        }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPOT = gql`
  query GetSpot($id: ID!) {
    spot(id: $id) {
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
      areas {
        id
        areaName
      }
      categories {
        id
        name
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
      createdAt
      updatedAt
    }
  }
`;
