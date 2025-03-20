/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetPlayPlans($limit: Int) {\n    playPlans(limit: $limit) {\n      id\n      planName\n      description\n      imageUrl\n      location\n      tripType\n      totalBudget\n      rating\n      reviewCount\n      favoriteCount\n      status\n      user {\n        id\n        username\n        profileImageUrl\n        role\n      }\n    }\n  }\n": typeof types.GetPlayPlansDocument,
    "\n  query GetRecommendedEvents {\n    events(limit: 5, upcoming: true) {\n      id\n      title\n      location\n      startDatetime\n      endDatetime\n      bannerImage\n      isOnline\n      eventCategory {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetRecommendedEventsDocument,
    "\n  query GetRecommendedSpots {\n    spots {\n      id\n      spotName\n      spotType\n      address\n      reviewRating\n      reviewCount\n      imageUrl\n      district {\n        districtName\n      }\n      categories {\n        name\n      }\n    }\n  }\n": typeof types.GetRecommendedSpotsDocument,
    "\n  query GetAreas {\n    areas {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n    }\n  }\n": typeof types.GetAreasDocument,
    "\n    query Categories {\n        categories {\n            id\n            name\n            createdAt\n            updatedAt\n        }\n    }\n": typeof types.CategoriesDocument,
    "\n  query GetDistricts {\n    districts {\n      id\n      districtName\n    }\n  }\n": typeof types.GetDistrictsDocument,
    "\n  query GetHashtags {\n    hashtags {\n      id\n      hashtagName\n    }\n  }\n": typeof types.GetHashtagsDocument,
    "\n  query GetPurposes {\n    purposes {\n      id\n      purposeName\n    }\n  }\n": typeof types.GetPurposesDocument,
    "\n  query GetSpot($id: ID!) {\n    spot(id: $id) {\n      id\n      spotName\n      address\n      phoneNumber\n      website\n      catchphrase\n      recommendedFor1\n      recommendedFor2\n      parkingAvailable\n      nearestStation\n      reviewRating\n      reviewCount\n      instagramUrl\n      isClosed\n      budgetRange\n      maxPeople\n      minPeople\n      isRainyOk\n      theme\n      spotType\n      district {\n        id\n        districtName\n      }\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      openingHours {\n        id\n        dayOfWeek\n        openTime\n        closeTime\n      }\n      instagramEmbeds {\n        id\n        instagramEmbedName\n        embedCode\n        embedUrl\n      }\n      menus {\n        id\n        menuName\n        price\n        description\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      purposes {\n        id\n        purposeName\n      }\n    }\n  }\n": typeof types.GetSpotDocument,
    "\n  query GetSpotAmbiances {\n    spotAmbiances {\n      id\n      ambianceName\n    }\n  }\n": typeof types.GetSpotAmbiancesDocument,
    "\n  query GetSpots {\n    spots {\n      id\n      spotName\n      address\n      catchphrase\n      parkingAvailable\n      reviewRating\n      reviewCount\n      budgetRange\n      theme\n      district {\n        id\n        districtName\n      }\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n    }\n  }\n": typeof types.GetSpotsDocument,
};
const documents: Documents = {
    "\n  query GetPlayPlans($limit: Int) {\n    playPlans(limit: $limit) {\n      id\n      planName\n      description\n      imageUrl\n      location\n      tripType\n      totalBudget\n      rating\n      reviewCount\n      favoriteCount\n      status\n      user {\n        id\n        username\n        profileImageUrl\n        role\n      }\n    }\n  }\n": types.GetPlayPlansDocument,
    "\n  query GetRecommendedEvents {\n    events(limit: 5, upcoming: true) {\n      id\n      title\n      location\n      startDatetime\n      endDatetime\n      bannerImage\n      isOnline\n      eventCategory {\n        id\n        name\n      }\n    }\n  }\n": types.GetRecommendedEventsDocument,
    "\n  query GetRecommendedSpots {\n    spots {\n      id\n      spotName\n      spotType\n      address\n      reviewRating\n      reviewCount\n      imageUrl\n      district {\n        districtName\n      }\n      categories {\n        name\n      }\n    }\n  }\n": types.GetRecommendedSpotsDocument,
    "\n  query GetAreas {\n    areas {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n    }\n  }\n": types.GetAreasDocument,
    "\n    query Categories {\n        categories {\n            id\n            name\n            createdAt\n            updatedAt\n        }\n    }\n": types.CategoriesDocument,
    "\n  query GetDistricts {\n    districts {\n      id\n      districtName\n    }\n  }\n": types.GetDistrictsDocument,
    "\n  query GetHashtags {\n    hashtags {\n      id\n      hashtagName\n    }\n  }\n": types.GetHashtagsDocument,
    "\n  query GetPurposes {\n    purposes {\n      id\n      purposeName\n    }\n  }\n": types.GetPurposesDocument,
    "\n  query GetSpot($id: ID!) {\n    spot(id: $id) {\n      id\n      spotName\n      address\n      phoneNumber\n      website\n      catchphrase\n      recommendedFor1\n      recommendedFor2\n      parkingAvailable\n      nearestStation\n      reviewRating\n      reviewCount\n      instagramUrl\n      isClosed\n      budgetRange\n      maxPeople\n      minPeople\n      isRainyOk\n      theme\n      spotType\n      district {\n        id\n        districtName\n      }\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      openingHours {\n        id\n        dayOfWeek\n        openTime\n        closeTime\n      }\n      instagramEmbeds {\n        id\n        instagramEmbedName\n        embedCode\n        embedUrl\n      }\n      menus {\n        id\n        menuName\n        price\n        description\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      purposes {\n        id\n        purposeName\n      }\n    }\n  }\n": types.GetSpotDocument,
    "\n  query GetSpotAmbiances {\n    spotAmbiances {\n      id\n      ambianceName\n    }\n  }\n": types.GetSpotAmbiancesDocument,
    "\n  query GetSpots {\n    spots {\n      id\n      spotName\n      address\n      catchphrase\n      parkingAvailable\n      reviewRating\n      reviewCount\n      budgetRange\n      theme\n      district {\n        id\n        districtName\n      }\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n    }\n  }\n": types.GetSpotsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPlayPlans($limit: Int) {\n    playPlans(limit: $limit) {\n      id\n      planName\n      description\n      imageUrl\n      location\n      tripType\n      totalBudget\n      rating\n      reviewCount\n      favoriteCount\n      status\n      user {\n        id\n        username\n        profileImageUrl\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPlayPlans($limit: Int) {\n    playPlans(limit: $limit) {\n      id\n      planName\n      description\n      imageUrl\n      location\n      tripType\n      totalBudget\n      rating\n      reviewCount\n      favoriteCount\n      status\n      user {\n        id\n        username\n        profileImageUrl\n        role\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRecommendedEvents {\n    events(limit: 5, upcoming: true) {\n      id\n      title\n      location\n      startDatetime\n      endDatetime\n      bannerImage\n      isOnline\n      eventCategory {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRecommendedEvents {\n    events(limit: 5, upcoming: true) {\n      id\n      title\n      location\n      startDatetime\n      endDatetime\n      bannerImage\n      isOnline\n      eventCategory {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRecommendedSpots {\n    spots {\n      id\n      spotName\n      spotType\n      address\n      reviewRating\n      reviewCount\n      imageUrl\n      district {\n        districtName\n      }\n      categories {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRecommendedSpots {\n    spots {\n      id\n      spotName\n      spotType\n      address\n      reviewRating\n      reviewCount\n      imageUrl\n      district {\n        districtName\n      }\n      categories {\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAreas {\n    areas {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAreas {\n    areas {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Categories {\n        categories {\n            id\n            name\n            createdAt\n            updatedAt\n        }\n    }\n"): (typeof documents)["\n    query Categories {\n        categories {\n            id\n            name\n            createdAt\n            updatedAt\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetDistricts {\n    districts {\n      id\n      districtName\n    }\n  }\n"): (typeof documents)["\n  query GetDistricts {\n    districts {\n      id\n      districtName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetHashtags {\n    hashtags {\n      id\n      hashtagName\n    }\n  }\n"): (typeof documents)["\n  query GetHashtags {\n    hashtags {\n      id\n      hashtagName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPurposes {\n    purposes {\n      id\n      purposeName\n    }\n  }\n"): (typeof documents)["\n  query GetPurposes {\n    purposes {\n      id\n      purposeName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpot($id: ID!) {\n    spot(id: $id) {\n      id\n      spotName\n      address\n      phoneNumber\n      website\n      catchphrase\n      recommendedFor1\n      recommendedFor2\n      parkingAvailable\n      nearestStation\n      reviewRating\n      reviewCount\n      instagramUrl\n      isClosed\n      budgetRange\n      maxPeople\n      minPeople\n      isRainyOk\n      theme\n      spotType\n      district {\n        id\n        districtName\n      }\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      openingHours {\n        id\n        dayOfWeek\n        openTime\n        closeTime\n      }\n      instagramEmbeds {\n        id\n        instagramEmbedName\n        embedCode\n        embedUrl\n      }\n      menus {\n        id\n        menuName\n        price\n        description\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      purposes {\n        id\n        purposeName\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSpot($id: ID!) {\n    spot(id: $id) {\n      id\n      spotName\n      address\n      phoneNumber\n      website\n      catchphrase\n      recommendedFor1\n      recommendedFor2\n      parkingAvailable\n      nearestStation\n      reviewRating\n      reviewCount\n      instagramUrl\n      isClosed\n      budgetRange\n      maxPeople\n      minPeople\n      isRainyOk\n      theme\n      spotType\n      district {\n        id\n        districtName\n      }\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      openingHours {\n        id\n        dayOfWeek\n        openTime\n        closeTime\n      }\n      instagramEmbeds {\n        id\n        instagramEmbedName\n        embedCode\n        embedUrl\n      }\n      menus {\n        id\n        menuName\n        price\n        description\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      purposes {\n        id\n        purposeName\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpotAmbiances {\n    spotAmbiances {\n      id\n      ambianceName\n    }\n  }\n"): (typeof documents)["\n  query GetSpotAmbiances {\n    spotAmbiances {\n      id\n      ambianceName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpots {\n    spots {\n      id\n      spotName\n      address\n      catchphrase\n      parkingAvailable\n      reviewRating\n      reviewCount\n      budgetRange\n      theme\n      district {\n        id\n        districtName\n      }\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSpots {\n    spots {\n      id\n      spotName\n      address\n      catchphrase\n      parkingAvailable\n      reviewRating\n      reviewCount\n      budgetRange\n      theme\n      district {\n        id\n        districtName\n      }\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;