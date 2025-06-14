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
    "\n  query GetDashboardStats {\n    dashboardStats {\n      spotsCount\n      areasCount\n      categoriesCount\n      playPlansCount\n      eventsCount\n      newsCount\n    }\n  }\n": typeof types.GetDashboardStatsDocument,
    "\n  mutation CreateArea($input: CreateAreaInput!) {\n    createArea(input: $input) {\n      area {\n        id\n        areaName\n        district {\n          id\n          districtName\n        }\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.CreateAreaDocument,
    "\n  mutation UpdateArea($input: UpdateAreaInput!) {\n    updateArea(input: $input) {\n      area {\n        id\n        areaName\n        district {\n          id\n          districtName\n        }\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.UpdateAreaDocument,
    "\n  mutation DeleteArea($input: DeleteAreaInput!) {\n    deleteArea(input: $input) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteAreaDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      category {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      category {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($input: DeleteCategoryInput!) {\n    deleteCategory(input: $input) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteCategoryDocument,
    "\n  mutation CreateDistrict($input: CreateDistrictInput!) {\n    createDistrict(input: $input) {\n      district {\n        id\n        districtName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.CreateDistrictDocument,
    "\n  mutation UpdateDistrict($input: UpdateDistrictInput!) {\n    updateDistrict(input: $input) {\n      district {\n        id\n        districtName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.UpdateDistrictDocument,
    "\n  mutation DeleteDistrict($input: DeleteDistrictInput!) {\n    deleteDistrict(input: $input) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteDistrictDocument,
    "\n  mutation CreateHashtag($input: CreateHashtagInput!) {\n    createHashtag(input: $input) {\n      hashtag {\n        id\n        hashtagName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.CreateHashtagDocument,
    "\n  mutation UpdateHashtag($input: UpdateHashtagInput!) {\n    updateHashtag(input: $input) {\n      hashtag {\n        id\n        hashtagName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.UpdateHashtagDocument,
    "\n  mutation DeleteHashtag($input: DeleteHashtagInput!) {\n    deleteHashtag(input: $input) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteHashtagDocument,
    "\n  mutation CreateMenu($menuName: String!) {\n    __typename\n  }\n": typeof types.CreateMenuDocument,
    "\n  mutation UpdateMenu($id: ID!, $menuName: String) {\n    __typename\n  }\n": typeof types.UpdateMenuDocument,
    "\n  mutation DeleteMenu($id: ID!) {\n    __typename\n  }\n": typeof types.DeleteMenuDocument,
    "\n  mutation CreatePurpose($input: CreatePurposeInput!) {\n    createPurpose(input: $input) {\n      purpose {\n        id\n        purposeName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.CreatePurposeDocument,
    "\n  mutation UpdatePurpose($input: UpdatePurposeInput!) {\n    updatePurpose(input: $input) {\n      purpose {\n        id\n        purposeName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.UpdatePurposeDocument,
    "\n  mutation DeletePurpose($input: DeletePurposeInput!) {\n    deletePurpose(input: $input) {\n      success\n      errors\n    }\n  }\n": typeof types.DeletePurposeDocument,
    "\n  mutation CreateRecommendedFor($input: CreateRecommendedForInput!) {\n    createRecommendedFor(input: $input) {\n      recommendedFor {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.CreateRecommendedForDocument,
    "\n  mutation UpdateRecommendedFor($input: UpdateRecommendedForInput!) {\n    updateRecommendedFor(input: $input) {\n      recommendedFor {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.UpdateRecommendedForDocument,
    "\n  mutation DeleteRecommendedFor($input: DeleteRecommendedForInput!) {\n    deleteRecommendedFor(input: $input) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteRecommendedForDocument,
    "\n  mutation CreateSpotAmbiance($input: CreateSpotAmbianceInput!) {\n    createSpotAmbiance(input: $input) {\n      spotAmbiance {\n        id\n        ambianceName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.CreateSpotAmbianceDocument,
    "\n  mutation UpdateSpotAmbiance($input: UpdateSpotAmbianceInput!) {\n    updateSpotAmbiance(input: $input) {\n      spotAmbiance {\n        id\n        ambianceName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.UpdateSpotAmbianceDocument,
    "\n  mutation DeleteSpotAmbiance($input: DeleteSpotAmbianceInput!) {\n    deleteSpotAmbiance(input: $input) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteSpotAmbianceDocument,
    "\n  mutation CreateSpot(\n    $input: CreateSpotInput!\n  ) {\n    createSpot(\n      input: $input\n    ) {\n      spot {\n        id\n        spotName\n        address\n        district {\n          id\n          districtName\n        }\n        districtId\n        phoneNumber\n        website\n        catchphrase\n        isRainyOk\n        budgetRange\n        spotType\n        theme\n        reviewRating\n        reviewCount\n        instagramUrl\n        isClosed\n        maxPeople\n        minPeople\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": typeof types.CreateSpotDocument,
    "\n  mutation UpdateSpot(\n    $input: UpdateSpotInput!\n  ) {\n    updateSpot(\n      input: $input\n    ) {\n      spot {\n        id\n        spotName\n        address\n        district {\n          id\n          districtName\n        }\n        districtId\n        phoneNumber\n        website\n        catchphrase\n        isRainyOk\n        budgetRange\n        spotType\n        theme\n        reviewRating\n        reviewCount\n        instagramUrl\n        isClosed\n        maxPeople\n        minPeople\n        recommendedFor1\n        recommendedFor2\n        imageUrl\n        nearestStation\n      }\n      errors\n    }\n  }\n": typeof types.UpdateSpotDocument,
    "\n  mutation DeleteSpot($id: ID!) {\n    deleteSpot(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteSpotDocument,
    "\n  mutation AddSpotArea($spotId: ID!, $areaId: ID!) {\n    __typename\n  }\n": typeof types.AddSpotAreaDocument,
    "\n  mutation RemoveSpotArea($spotId: ID!, $areaId: ID!) {\n    __typename\n  }\n": typeof types.RemoveSpotAreaDocument,
    "\n  mutation AddSpotCategory($spotId: ID!, $categoryId: ID!) {\n    __typename\n  }\n": typeof types.AddSpotCategoryDocument,
    "\n  mutation RemoveSpotCategory($spotId: ID!, $categoryId: ID!) {\n    __typename\n  }\n": typeof types.RemoveSpotCategoryDocument,
    "\n  mutation AddSpotHashtag($spotId: ID!, $hashtagId: ID!) {\n    __typename\n  }\n": typeof types.AddSpotHashtagDocument,
    "\n  mutation RemoveSpotHashtag($spotId: ID!, $hashtagId: ID!) {\n    __typename\n  }\n": typeof types.RemoveSpotHashtagDocument,
    "\n  mutation AddSpotMenu($spotId: ID!, $menuId: ID!) {\n    __typename\n  }\n": typeof types.AddSpotMenuDocument,
    "\n  mutation RemoveSpotMenu($spotId: ID!, $menuId: ID!) {\n    __typename\n  }\n": typeof types.RemoveSpotMenuDocument,
    "\n  mutation AddSpotPurpose($spotId: ID!, $purposeId: ID!) {\n    __typename\n  }\n": typeof types.AddSpotPurposeDocument,
    "\n  mutation RemoveSpotPurpose($spotId: ID!, $purposeId: ID!) {\n    __typename\n  }\n": typeof types.RemoveSpotPurposeDocument,
    "\n  mutation AddSpotAmbiance($spotId: ID!, $ambianceId: ID!) {\n    __typename\n  }\n": typeof types.AddSpotAmbianceDocument,
    "\n  mutation RemoveSpotAmbiance($spotId: ID!, $ambianceId: ID!) {\n    __typename\n  }\n": typeof types.RemoveSpotAmbianceDocument,
    "\n  query GetEnumValues($enumName: String!) {\n    __type(name: $enumName) {\n      enumValues {\n        name\n      }\n    }\n  }\n": typeof types.GetEnumValuesDocument,
    "\n  mutation CreateStation($input: CreateStationInput!) {\n    createStation(input: $input) {\n      station {\n        name\n        trainLine\n        active\n        description\n      }\n    }\n  }\n": typeof types.CreateStationDocument,
    "\n  mutation UpdateStation($input: UpdateStationInput!) {\n    updateStation(input: $input) {\n      station {\n        id\n        name\n        trainLine\n        active\n        description\n      }\n    }\n  }\n": typeof types.UpdateStationDocument,
    "\n  mutation DeleteStation($input: DeleteStationInput!) {\n    deleteStation(input: $input) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteStationDocument,
    "\n  query GetAreas {\n    areas {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetAreasDocument,
    "\n  query GetArea($id: ID!) {\n    area(id: $id) {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetAreaDocument,
    "\n    query Categories {\n        categories {\n            id\n            name\n            createdAt\n            updatedAt\n        }\n    }\n": typeof types.CategoriesDocument,
    "\n  query GetDistricts {\n    districts {\n      id\n      districtName\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetDistrictsDocument,
    "\n  query GetDistrict($id: ID!) {\n    district(id: $id) {\n      id\n      districtName\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetDistrictDocument,
    "\n  query GetSpotTypeEnum {\n    __type(name: \"SpotTypeEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n": typeof types.GetSpotTypeEnumDocument,
    "\n  query GetBudgetRangeEnum {\n    __type(name: \"BudgetTypeRangeEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n": typeof types.GetBudgetRangeEnumDocument,
    "\n  query GetTrainLineEnum {\n    __type(name: \"TrainLineEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n": typeof types.GetTrainLineEnumDocument,
    "\n  query GetEvents($limit: Int) {\n    events(limit: $limit) {\n      id\n      title\n      description\n      location\n      startDatetime\n      endDatetime\n      status\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetEventsDocument,
    "\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      id\n      title\n      description\n      location\n      latitude\n      longitude\n      startDatetime\n      endDatetime\n      recurringRule\n      price\n      organizer\n      contactEmail\n      contactPhone\n      capacity\n      isOnline\n      sourceUrl\n      bannerImage\n      status\n      eventCategory {\n        id\n        name\n        description\n      }\n      eventCategoryId\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetEventDocument,
    "\n  query GetHashtags {\n    hashtags {\n      id\n      hashtagName\n    }\n  }\n": typeof types.GetHashtagsDocument,
    "\n  query GetMenus {\n    __typename\n  }\n": typeof types.GetMenusDocument,
    "\n  query GetMenu($id: ID!) {\n    __typename\n  }\n": typeof types.GetMenuDocument,
    "\n  query GetNewsList($categoryId: ID, $limit: Int) {\n    news(categoryId: $categoryId, limit: $limit) {\n      id\n      title\n      body\n      publishedAt\n      status\n      imageUrl\n      category {\n        id\n        name\n      }\n      author {\n        id\n        username\n        profileImageUrl\n      }\n      createdAt\n      updatedAt\n    }\n    categories {\n      id\n      name\n    }\n  }\n": typeof types.GetNewsListDocument,
    "\n  query GetPlayPlans($limit: Int) {\n    playPlans(limit: $limit) {\n      id\n      planName\n      description\n      imageUrl\n      location\n      tripType\n      totalBudget\n      rating\n      reviewCount\n      favoriteCount\n      isFavorite\n      status\n      user {\n        id\n        username\n        profileImageUrl\n        role\n      }\n    }\n  }\n": typeof types.GetPlayPlansDocument,
    "\n  query GetPurposes {\n    purposes {\n      id\n      purposeName\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetPurposesDocument,
    "\n  query GetRecommendedFors {\n    recommendedFors {\n      id\n      name\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetRecommendedForsDocument,
    "\n  query GetSpotAmbiances {\n    spotAmbiances {\n      id\n      ambianceName\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetSpotAmbiancesDocument,
    "\n  query GetSpots {\n    spots {\n      id\n      spotName\n      address\n      district {\n        id\n        districtName\n      }\n      districtId\n      phoneNumber\n      website\n      catchphrase\n      isRainyOk\n      budgetRange\n      instagramUrl\n      nearestStation\n      isClosed\n      imageUrl\n      minPeople\n      maxPeople\n      recommendedFor1\n      recommendedFor2\n      reviewCount\n      reviewRating\n      spotType\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      purposes {\n        id\n        purposeName\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetSpotsDocument,
    "\n  query GetSpot($id: ID!) {\n    spot(id: $id) {\n      id\n      spotName\n      address\n      district {\n        id\n        districtName\n      }\n      districtId\n      phoneNumber\n      website\n      catchphrase\n      isRainyOk\n      budgetRange\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      purposes {\n        id\n        purposeName\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetSpotDocument,
    "\n  query GetStations {\n    stations {\n      id\n      name\n      trainLine\n      description\n      active\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetStationsDocument,
};
const documents: Documents = {
    "\n  query GetDashboardStats {\n    dashboardStats {\n      spotsCount\n      areasCount\n      categoriesCount\n      playPlansCount\n      eventsCount\n      newsCount\n    }\n  }\n": types.GetDashboardStatsDocument,
    "\n  mutation CreateArea($input: CreateAreaInput!) {\n    createArea(input: $input) {\n      area {\n        id\n        areaName\n        district {\n          id\n          districtName\n        }\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.CreateAreaDocument,
    "\n  mutation UpdateArea($input: UpdateAreaInput!) {\n    updateArea(input: $input) {\n      area {\n        id\n        areaName\n        district {\n          id\n          districtName\n        }\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.UpdateAreaDocument,
    "\n  mutation DeleteArea($input: DeleteAreaInput!) {\n    deleteArea(input: $input) {\n      success\n      errors\n    }\n  }\n": types.DeleteAreaDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      category {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      category {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($input: DeleteCategoryInput!) {\n    deleteCategory(input: $input) {\n      success\n      errors\n    }\n  }\n": types.DeleteCategoryDocument,
    "\n  mutation CreateDistrict($input: CreateDistrictInput!) {\n    createDistrict(input: $input) {\n      district {\n        id\n        districtName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.CreateDistrictDocument,
    "\n  mutation UpdateDistrict($input: UpdateDistrictInput!) {\n    updateDistrict(input: $input) {\n      district {\n        id\n        districtName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.UpdateDistrictDocument,
    "\n  mutation DeleteDistrict($input: DeleteDistrictInput!) {\n    deleteDistrict(input: $input) {\n      success\n      errors\n    }\n  }\n": types.DeleteDistrictDocument,
    "\n  mutation CreateHashtag($input: CreateHashtagInput!) {\n    createHashtag(input: $input) {\n      hashtag {\n        id\n        hashtagName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.CreateHashtagDocument,
    "\n  mutation UpdateHashtag($input: UpdateHashtagInput!) {\n    updateHashtag(input: $input) {\n      hashtag {\n        id\n        hashtagName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.UpdateHashtagDocument,
    "\n  mutation DeleteHashtag($input: DeleteHashtagInput!) {\n    deleteHashtag(input: $input) {\n      success\n      errors\n    }\n  }\n": types.DeleteHashtagDocument,
    "\n  mutation CreateMenu($menuName: String!) {\n    __typename\n  }\n": types.CreateMenuDocument,
    "\n  mutation UpdateMenu($id: ID!, $menuName: String) {\n    __typename\n  }\n": types.UpdateMenuDocument,
    "\n  mutation DeleteMenu($id: ID!) {\n    __typename\n  }\n": types.DeleteMenuDocument,
    "\n  mutation CreatePurpose($input: CreatePurposeInput!) {\n    createPurpose(input: $input) {\n      purpose {\n        id\n        purposeName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.CreatePurposeDocument,
    "\n  mutation UpdatePurpose($input: UpdatePurposeInput!) {\n    updatePurpose(input: $input) {\n      purpose {\n        id\n        purposeName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.UpdatePurposeDocument,
    "\n  mutation DeletePurpose($input: DeletePurposeInput!) {\n    deletePurpose(input: $input) {\n      success\n      errors\n    }\n  }\n": types.DeletePurposeDocument,
    "\n  mutation CreateRecommendedFor($input: CreateRecommendedForInput!) {\n    createRecommendedFor(input: $input) {\n      recommendedFor {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.CreateRecommendedForDocument,
    "\n  mutation UpdateRecommendedFor($input: UpdateRecommendedForInput!) {\n    updateRecommendedFor(input: $input) {\n      recommendedFor {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.UpdateRecommendedForDocument,
    "\n  mutation DeleteRecommendedFor($input: DeleteRecommendedForInput!) {\n    deleteRecommendedFor(input: $input) {\n      success\n      errors\n    }\n  }\n": types.DeleteRecommendedForDocument,
    "\n  mutation CreateSpotAmbiance($input: CreateSpotAmbianceInput!) {\n    createSpotAmbiance(input: $input) {\n      spotAmbiance {\n        id\n        ambianceName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.CreateSpotAmbianceDocument,
    "\n  mutation UpdateSpotAmbiance($input: UpdateSpotAmbianceInput!) {\n    updateSpotAmbiance(input: $input) {\n      spotAmbiance {\n        id\n        ambianceName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.UpdateSpotAmbianceDocument,
    "\n  mutation DeleteSpotAmbiance($input: DeleteSpotAmbianceInput!) {\n    deleteSpotAmbiance(input: $input) {\n      success\n      errors\n    }\n  }\n": types.DeleteSpotAmbianceDocument,
    "\n  mutation CreateSpot(\n    $input: CreateSpotInput!\n  ) {\n    createSpot(\n      input: $input\n    ) {\n      spot {\n        id\n        spotName\n        address\n        district {\n          id\n          districtName\n        }\n        districtId\n        phoneNumber\n        website\n        catchphrase\n        isRainyOk\n        budgetRange\n        spotType\n        theme\n        reviewRating\n        reviewCount\n        instagramUrl\n        isClosed\n        maxPeople\n        minPeople\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n": types.CreateSpotDocument,
    "\n  mutation UpdateSpot(\n    $input: UpdateSpotInput!\n  ) {\n    updateSpot(\n      input: $input\n    ) {\n      spot {\n        id\n        spotName\n        address\n        district {\n          id\n          districtName\n        }\n        districtId\n        phoneNumber\n        website\n        catchphrase\n        isRainyOk\n        budgetRange\n        spotType\n        theme\n        reviewRating\n        reviewCount\n        instagramUrl\n        isClosed\n        maxPeople\n        minPeople\n        recommendedFor1\n        recommendedFor2\n        imageUrl\n        nearestStation\n      }\n      errors\n    }\n  }\n": types.UpdateSpotDocument,
    "\n  mutation DeleteSpot($id: ID!) {\n    deleteSpot(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n": types.DeleteSpotDocument,
    "\n  mutation AddSpotArea($spotId: ID!, $areaId: ID!) {\n    __typename\n  }\n": types.AddSpotAreaDocument,
    "\n  mutation RemoveSpotArea($spotId: ID!, $areaId: ID!) {\n    __typename\n  }\n": types.RemoveSpotAreaDocument,
    "\n  mutation AddSpotCategory($spotId: ID!, $categoryId: ID!) {\n    __typename\n  }\n": types.AddSpotCategoryDocument,
    "\n  mutation RemoveSpotCategory($spotId: ID!, $categoryId: ID!) {\n    __typename\n  }\n": types.RemoveSpotCategoryDocument,
    "\n  mutation AddSpotHashtag($spotId: ID!, $hashtagId: ID!) {\n    __typename\n  }\n": types.AddSpotHashtagDocument,
    "\n  mutation RemoveSpotHashtag($spotId: ID!, $hashtagId: ID!) {\n    __typename\n  }\n": types.RemoveSpotHashtagDocument,
    "\n  mutation AddSpotMenu($spotId: ID!, $menuId: ID!) {\n    __typename\n  }\n": types.AddSpotMenuDocument,
    "\n  mutation RemoveSpotMenu($spotId: ID!, $menuId: ID!) {\n    __typename\n  }\n": types.RemoveSpotMenuDocument,
    "\n  mutation AddSpotPurpose($spotId: ID!, $purposeId: ID!) {\n    __typename\n  }\n": types.AddSpotPurposeDocument,
    "\n  mutation RemoveSpotPurpose($spotId: ID!, $purposeId: ID!) {\n    __typename\n  }\n": types.RemoveSpotPurposeDocument,
    "\n  mutation AddSpotAmbiance($spotId: ID!, $ambianceId: ID!) {\n    __typename\n  }\n": types.AddSpotAmbianceDocument,
    "\n  mutation RemoveSpotAmbiance($spotId: ID!, $ambianceId: ID!) {\n    __typename\n  }\n": types.RemoveSpotAmbianceDocument,
    "\n  query GetEnumValues($enumName: String!) {\n    __type(name: $enumName) {\n      enumValues {\n        name\n      }\n    }\n  }\n": types.GetEnumValuesDocument,
    "\n  mutation CreateStation($input: CreateStationInput!) {\n    createStation(input: $input) {\n      station {\n        name\n        trainLine\n        active\n        description\n      }\n    }\n  }\n": types.CreateStationDocument,
    "\n  mutation UpdateStation($input: UpdateStationInput!) {\n    updateStation(input: $input) {\n      station {\n        id\n        name\n        trainLine\n        active\n        description\n      }\n    }\n  }\n": types.UpdateStationDocument,
    "\n  mutation DeleteStation($input: DeleteStationInput!) {\n    deleteStation(input: $input) {\n      success\n      errors\n    }\n  }\n": types.DeleteStationDocument,
    "\n  query GetAreas {\n    areas {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetAreasDocument,
    "\n  query GetArea($id: ID!) {\n    area(id: $id) {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetAreaDocument,
    "\n    query Categories {\n        categories {\n            id\n            name\n            createdAt\n            updatedAt\n        }\n    }\n": types.CategoriesDocument,
    "\n  query GetDistricts {\n    districts {\n      id\n      districtName\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetDistrictsDocument,
    "\n  query GetDistrict($id: ID!) {\n    district(id: $id) {\n      id\n      districtName\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetDistrictDocument,
    "\n  query GetSpotTypeEnum {\n    __type(name: \"SpotTypeEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n": types.GetSpotTypeEnumDocument,
    "\n  query GetBudgetRangeEnum {\n    __type(name: \"BudgetTypeRangeEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n": types.GetBudgetRangeEnumDocument,
    "\n  query GetTrainLineEnum {\n    __type(name: \"TrainLineEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n": types.GetTrainLineEnumDocument,
    "\n  query GetEvents($limit: Int) {\n    events(limit: $limit) {\n      id\n      title\n      description\n      location\n      startDatetime\n      endDatetime\n      status\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetEventsDocument,
    "\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      id\n      title\n      description\n      location\n      latitude\n      longitude\n      startDatetime\n      endDatetime\n      recurringRule\n      price\n      organizer\n      contactEmail\n      contactPhone\n      capacity\n      isOnline\n      sourceUrl\n      bannerImage\n      status\n      eventCategory {\n        id\n        name\n        description\n      }\n      eventCategoryId\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetEventDocument,
    "\n  query GetHashtags {\n    hashtags {\n      id\n      hashtagName\n    }\n  }\n": types.GetHashtagsDocument,
    "\n  query GetMenus {\n    __typename\n  }\n": types.GetMenusDocument,
    "\n  query GetMenu($id: ID!) {\n    __typename\n  }\n": types.GetMenuDocument,
    "\n  query GetNewsList($categoryId: ID, $limit: Int) {\n    news(categoryId: $categoryId, limit: $limit) {\n      id\n      title\n      body\n      publishedAt\n      status\n      imageUrl\n      category {\n        id\n        name\n      }\n      author {\n        id\n        username\n        profileImageUrl\n      }\n      createdAt\n      updatedAt\n    }\n    categories {\n      id\n      name\n    }\n  }\n": types.GetNewsListDocument,
    "\n  query GetPlayPlans($limit: Int) {\n    playPlans(limit: $limit) {\n      id\n      planName\n      description\n      imageUrl\n      location\n      tripType\n      totalBudget\n      rating\n      reviewCount\n      favoriteCount\n      isFavorite\n      status\n      user {\n        id\n        username\n        profileImageUrl\n        role\n      }\n    }\n  }\n": types.GetPlayPlansDocument,
    "\n  query GetPurposes {\n    purposes {\n      id\n      purposeName\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetPurposesDocument,
    "\n  query GetRecommendedFors {\n    recommendedFors {\n      id\n      name\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetRecommendedForsDocument,
    "\n  query GetSpotAmbiances {\n    spotAmbiances {\n      id\n      ambianceName\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetSpotAmbiancesDocument,
    "\n  query GetSpots {\n    spots {\n      id\n      spotName\n      address\n      district {\n        id\n        districtName\n      }\n      districtId\n      phoneNumber\n      website\n      catchphrase\n      isRainyOk\n      budgetRange\n      instagramUrl\n      nearestStation\n      isClosed\n      imageUrl\n      minPeople\n      maxPeople\n      recommendedFor1\n      recommendedFor2\n      reviewCount\n      reviewRating\n      spotType\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      purposes {\n        id\n        purposeName\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetSpotsDocument,
    "\n  query GetSpot($id: ID!) {\n    spot(id: $id) {\n      id\n      spotName\n      address\n      district {\n        id\n        districtName\n      }\n      districtId\n      phoneNumber\n      website\n      catchphrase\n      isRainyOk\n      budgetRange\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      purposes {\n        id\n        purposeName\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetSpotDocument,
    "\n  query GetStations {\n    stations {\n      id\n      name\n      trainLine\n      description\n      active\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetStationsDocument,
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
export function gql(source: "\n  query GetDashboardStats {\n    dashboardStats {\n      spotsCount\n      areasCount\n      categoriesCount\n      playPlansCount\n      eventsCount\n      newsCount\n    }\n  }\n"): (typeof documents)["\n  query GetDashboardStats {\n    dashboardStats {\n      spotsCount\n      areasCount\n      categoriesCount\n      playPlansCount\n      eventsCount\n      newsCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateArea($input: CreateAreaInput!) {\n    createArea(input: $input) {\n      area {\n        id\n        areaName\n        district {\n          id\n          districtName\n        }\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateArea($input: CreateAreaInput!) {\n    createArea(input: $input) {\n      area {\n        id\n        areaName\n        district {\n          id\n          districtName\n        }\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateArea($input: UpdateAreaInput!) {\n    updateArea(input: $input) {\n      area {\n        id\n        areaName\n        district {\n          id\n          districtName\n        }\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateArea($input: UpdateAreaInput!) {\n    updateArea(input: $input) {\n      area {\n        id\n        areaName\n        district {\n          id\n          districtName\n        }\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteArea($input: DeleteAreaInput!) {\n    deleteArea(input: $input) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteArea($input: DeleteAreaInput!) {\n    deleteArea(input: $input) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      category {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      category {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      category {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      category {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteCategory($input: DeleteCategoryInput!) {\n    deleteCategory(input: $input) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCategory($input: DeleteCategoryInput!) {\n    deleteCategory(input: $input) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateDistrict($input: CreateDistrictInput!) {\n    createDistrict(input: $input) {\n      district {\n        id\n        districtName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDistrict($input: CreateDistrictInput!) {\n    createDistrict(input: $input) {\n      district {\n        id\n        districtName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateDistrict($input: UpdateDistrictInput!) {\n    updateDistrict(input: $input) {\n      district {\n        id\n        districtName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDistrict($input: UpdateDistrictInput!) {\n    updateDistrict(input: $input) {\n      district {\n        id\n        districtName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteDistrict($input: DeleteDistrictInput!) {\n    deleteDistrict(input: $input) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteDistrict($input: DeleteDistrictInput!) {\n    deleteDistrict(input: $input) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateHashtag($input: CreateHashtagInput!) {\n    createHashtag(input: $input) {\n      hashtag {\n        id\n        hashtagName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateHashtag($input: CreateHashtagInput!) {\n    createHashtag(input: $input) {\n      hashtag {\n        id\n        hashtagName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateHashtag($input: UpdateHashtagInput!) {\n    updateHashtag(input: $input) {\n      hashtag {\n        id\n        hashtagName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateHashtag($input: UpdateHashtagInput!) {\n    updateHashtag(input: $input) {\n      hashtag {\n        id\n        hashtagName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteHashtag($input: DeleteHashtagInput!) {\n    deleteHashtag(input: $input) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteHashtag($input: DeleteHashtagInput!) {\n    deleteHashtag(input: $input) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateMenu($menuName: String!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation CreateMenu($menuName: String!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMenu($id: ID!, $menuName: String) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation UpdateMenu($id: ID!, $menuName: String) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteMenu($id: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation DeleteMenu($id: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePurpose($input: CreatePurposeInput!) {\n    createPurpose(input: $input) {\n      purpose {\n        id\n        purposeName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePurpose($input: CreatePurposeInput!) {\n    createPurpose(input: $input) {\n      purpose {\n        id\n        purposeName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdatePurpose($input: UpdatePurposeInput!) {\n    updatePurpose(input: $input) {\n      purpose {\n        id\n        purposeName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePurpose($input: UpdatePurposeInput!) {\n    updatePurpose(input: $input) {\n      purpose {\n        id\n        purposeName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeletePurpose($input: DeletePurposeInput!) {\n    deletePurpose(input: $input) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePurpose($input: DeletePurposeInput!) {\n    deletePurpose(input: $input) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateRecommendedFor($input: CreateRecommendedForInput!) {\n    createRecommendedFor(input: $input) {\n      recommendedFor {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRecommendedFor($input: CreateRecommendedForInput!) {\n    createRecommendedFor(input: $input) {\n      recommendedFor {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateRecommendedFor($input: UpdateRecommendedForInput!) {\n    updateRecommendedFor(input: $input) {\n      recommendedFor {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRecommendedFor($input: UpdateRecommendedForInput!) {\n    updateRecommendedFor(input: $input) {\n      recommendedFor {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteRecommendedFor($input: DeleteRecommendedForInput!) {\n    deleteRecommendedFor(input: $input) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteRecommendedFor($input: DeleteRecommendedForInput!) {\n    deleteRecommendedFor(input: $input) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateSpotAmbiance($input: CreateSpotAmbianceInput!) {\n    createSpotAmbiance(input: $input) {\n      spotAmbiance {\n        id\n        ambianceName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSpotAmbiance($input: CreateSpotAmbianceInput!) {\n    createSpotAmbiance(input: $input) {\n      spotAmbiance {\n        id\n        ambianceName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateSpotAmbiance($input: UpdateSpotAmbianceInput!) {\n    updateSpotAmbiance(input: $input) {\n      spotAmbiance {\n        id\n        ambianceName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSpotAmbiance($input: UpdateSpotAmbianceInput!) {\n    updateSpotAmbiance(input: $input) {\n      spotAmbiance {\n        id\n        ambianceName\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteSpotAmbiance($input: DeleteSpotAmbianceInput!) {\n    deleteSpotAmbiance(input: $input) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSpotAmbiance($input: DeleteSpotAmbianceInput!) {\n    deleteSpotAmbiance(input: $input) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateSpot(\n    $input: CreateSpotInput!\n  ) {\n    createSpot(\n      input: $input\n    ) {\n      spot {\n        id\n        spotName\n        address\n        district {\n          id\n          districtName\n        }\n        districtId\n        phoneNumber\n        website\n        catchphrase\n        isRainyOk\n        budgetRange\n        spotType\n        theme\n        reviewRating\n        reviewCount\n        instagramUrl\n        isClosed\n        maxPeople\n        minPeople\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSpot(\n    $input: CreateSpotInput!\n  ) {\n    createSpot(\n      input: $input\n    ) {\n      spot {\n        id\n        spotName\n        address\n        district {\n          id\n          districtName\n        }\n        districtId\n        phoneNumber\n        website\n        catchphrase\n        isRainyOk\n        budgetRange\n        spotType\n        theme\n        reviewRating\n        reviewCount\n        instagramUrl\n        isClosed\n        maxPeople\n        minPeople\n        createdAt\n        updatedAt\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateSpot(\n    $input: UpdateSpotInput!\n  ) {\n    updateSpot(\n      input: $input\n    ) {\n      spot {\n        id\n        spotName\n        address\n        district {\n          id\n          districtName\n        }\n        districtId\n        phoneNumber\n        website\n        catchphrase\n        isRainyOk\n        budgetRange\n        spotType\n        theme\n        reviewRating\n        reviewCount\n        instagramUrl\n        isClosed\n        maxPeople\n        minPeople\n        recommendedFor1\n        recommendedFor2\n        imageUrl\n        nearestStation\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSpot(\n    $input: UpdateSpotInput!\n  ) {\n    updateSpot(\n      input: $input\n    ) {\n      spot {\n        id\n        spotName\n        address\n        district {\n          id\n          districtName\n        }\n        districtId\n        phoneNumber\n        website\n        catchphrase\n        isRainyOk\n        budgetRange\n        spotType\n        theme\n        reviewRating\n        reviewCount\n        instagramUrl\n        isClosed\n        maxPeople\n        minPeople\n        recommendedFor1\n        recommendedFor2\n        imageUrl\n        nearestStation\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteSpot($id: ID!) {\n    deleteSpot(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSpot($id: ID!) {\n    deleteSpot(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddSpotArea($spotId: ID!, $areaId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation AddSpotArea($spotId: ID!, $areaId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveSpotArea($spotId: ID!, $areaId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation RemoveSpotArea($spotId: ID!, $areaId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddSpotCategory($spotId: ID!, $categoryId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation AddSpotCategory($spotId: ID!, $categoryId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveSpotCategory($spotId: ID!, $categoryId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation RemoveSpotCategory($spotId: ID!, $categoryId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddSpotHashtag($spotId: ID!, $hashtagId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation AddSpotHashtag($spotId: ID!, $hashtagId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveSpotHashtag($spotId: ID!, $hashtagId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation RemoveSpotHashtag($spotId: ID!, $hashtagId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddSpotMenu($spotId: ID!, $menuId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation AddSpotMenu($spotId: ID!, $menuId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveSpotMenu($spotId: ID!, $menuId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation RemoveSpotMenu($spotId: ID!, $menuId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddSpotPurpose($spotId: ID!, $purposeId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation AddSpotPurpose($spotId: ID!, $purposeId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveSpotPurpose($spotId: ID!, $purposeId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation RemoveSpotPurpose($spotId: ID!, $purposeId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddSpotAmbiance($spotId: ID!, $ambianceId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation AddSpotAmbiance($spotId: ID!, $ambianceId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveSpotAmbiance($spotId: ID!, $ambianceId: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  mutation RemoveSpotAmbiance($spotId: ID!, $ambianceId: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEnumValues($enumName: String!) {\n    __type(name: $enumName) {\n      enumValues {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEnumValues($enumName: String!) {\n    __type(name: $enumName) {\n      enumValues {\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateStation($input: CreateStationInput!) {\n    createStation(input: $input) {\n      station {\n        name\n        trainLine\n        active\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateStation($input: CreateStationInput!) {\n    createStation(input: $input) {\n      station {\n        name\n        trainLine\n        active\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateStation($input: UpdateStationInput!) {\n    updateStation(input: $input) {\n      station {\n        id\n        name\n        trainLine\n        active\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateStation($input: UpdateStationInput!) {\n    updateStation(input: $input) {\n      station {\n        id\n        name\n        trainLine\n        active\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteStation($input: DeleteStationInput!) {\n    deleteStation(input: $input) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteStation($input: DeleteStationInput!) {\n    deleteStation(input: $input) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAreas {\n    areas {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetAreas {\n    areas {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetArea($id: ID!) {\n    area(id: $id) {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetArea($id: ID!) {\n    area(id: $id) {\n      id\n      areaName\n      district {\n        id\n        districtName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Categories {\n        categories {\n            id\n            name\n            createdAt\n            updatedAt\n        }\n    }\n"): (typeof documents)["\n    query Categories {\n        categories {\n            id\n            name\n            createdAt\n            updatedAt\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetDistricts {\n    districts {\n      id\n      districtName\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetDistricts {\n    districts {\n      id\n      districtName\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetDistrict($id: ID!) {\n    district(id: $id) {\n      id\n      districtName\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetDistrict($id: ID!) {\n    district(id: $id) {\n      id\n      districtName\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpotTypeEnum {\n    __type(name: \"SpotTypeEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSpotTypeEnum {\n    __type(name: \"SpotTypeEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBudgetRangeEnum {\n    __type(name: \"BudgetTypeRangeEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBudgetRangeEnum {\n    __type(name: \"BudgetTypeRangeEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTrainLineEnum {\n    __type(name: \"TrainLineEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTrainLineEnum {\n    __type(name: \"TrainLineEnum\") {\n      enumValues {\n        name\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEvents($limit: Int) {\n    events(limit: $limit) {\n      id\n      title\n      description\n      location\n      startDatetime\n      endDatetime\n      status\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetEvents($limit: Int) {\n    events(limit: $limit) {\n      id\n      title\n      description\n      location\n      startDatetime\n      endDatetime\n      status\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      id\n      title\n      description\n      location\n      latitude\n      longitude\n      startDatetime\n      endDatetime\n      recurringRule\n      price\n      organizer\n      contactEmail\n      contactPhone\n      capacity\n      isOnline\n      sourceUrl\n      bannerImage\n      status\n      eventCategory {\n        id\n        name\n        description\n      }\n      eventCategoryId\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      id\n      title\n      description\n      location\n      latitude\n      longitude\n      startDatetime\n      endDatetime\n      recurringRule\n      price\n      organizer\n      contactEmail\n      contactPhone\n      capacity\n      isOnline\n      sourceUrl\n      bannerImage\n      status\n      eventCategory {\n        id\n        name\n        description\n      }\n      eventCategoryId\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetHashtags {\n    hashtags {\n      id\n      hashtagName\n    }\n  }\n"): (typeof documents)["\n  query GetHashtags {\n    hashtags {\n      id\n      hashtagName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMenus {\n    __typename\n  }\n"): (typeof documents)["\n  query GetMenus {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMenu($id: ID!) {\n    __typename\n  }\n"): (typeof documents)["\n  query GetMenu($id: ID!) {\n    __typename\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetNewsList($categoryId: ID, $limit: Int) {\n    news(categoryId: $categoryId, limit: $limit) {\n      id\n      title\n      body\n      publishedAt\n      status\n      imageUrl\n      category {\n        id\n        name\n      }\n      author {\n        id\n        username\n        profileImageUrl\n      }\n      createdAt\n      updatedAt\n    }\n    categories {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetNewsList($categoryId: ID, $limit: Int) {\n    news(categoryId: $categoryId, limit: $limit) {\n      id\n      title\n      body\n      publishedAt\n      status\n      imageUrl\n      category {\n        id\n        name\n      }\n      author {\n        id\n        username\n        profileImageUrl\n      }\n      createdAt\n      updatedAt\n    }\n    categories {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPlayPlans($limit: Int) {\n    playPlans(limit: $limit) {\n      id\n      planName\n      description\n      imageUrl\n      location\n      tripType\n      totalBudget\n      rating\n      reviewCount\n      favoriteCount\n      isFavorite\n      status\n      user {\n        id\n        username\n        profileImageUrl\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPlayPlans($limit: Int) {\n    playPlans(limit: $limit) {\n      id\n      planName\n      description\n      imageUrl\n      location\n      tripType\n      totalBudget\n      rating\n      reviewCount\n      favoriteCount\n      isFavorite\n      status\n      user {\n        id\n        username\n        profileImageUrl\n        role\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPurposes {\n    purposes {\n      id\n      purposeName\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetPurposes {\n    purposes {\n      id\n      purposeName\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRecommendedFors {\n    recommendedFors {\n      id\n      name\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetRecommendedFors {\n    recommendedFors {\n      id\n      name\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpotAmbiances {\n    spotAmbiances {\n      id\n      ambianceName\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetSpotAmbiances {\n    spotAmbiances {\n      id\n      ambianceName\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpots {\n    spots {\n      id\n      spotName\n      address\n      district {\n        id\n        districtName\n      }\n      districtId\n      phoneNumber\n      website\n      catchphrase\n      isRainyOk\n      budgetRange\n      instagramUrl\n      nearestStation\n      isClosed\n      imageUrl\n      minPeople\n      maxPeople\n      recommendedFor1\n      recommendedFor2\n      reviewCount\n      reviewRating\n      spotType\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      purposes {\n        id\n        purposeName\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetSpots {\n    spots {\n      id\n      spotName\n      address\n      district {\n        id\n        districtName\n      }\n      districtId\n      phoneNumber\n      website\n      catchphrase\n      isRainyOk\n      budgetRange\n      instagramUrl\n      nearestStation\n      isClosed\n      imageUrl\n      minPeople\n      maxPeople\n      recommendedFor1\n      recommendedFor2\n      reviewCount\n      reviewRating\n      spotType\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      purposes {\n        id\n        purposeName\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetSpot($id: ID!) {\n    spot(id: $id) {\n      id\n      spotName\n      address\n      district {\n        id\n        districtName\n      }\n      districtId\n      phoneNumber\n      website\n      catchphrase\n      isRainyOk\n      budgetRange\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      purposes {\n        id\n        purposeName\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetSpot($id: ID!) {\n    spot(id: $id) {\n      id\n      spotName\n      address\n      district {\n        id\n        districtName\n      }\n      districtId\n      phoneNumber\n      website\n      catchphrase\n      isRainyOk\n      budgetRange\n      areas {\n        id\n        areaName\n      }\n      categories {\n        id\n        name\n      }\n      hashtags {\n        id\n        hashtagName\n      }\n      purposes {\n        id\n        purposeName\n      }\n      spotAmbiances {\n        id\n        ambianceName\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetStations {\n    stations {\n      id\n      name\n      trainLine\n      description\n      active\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetStations {\n    stations {\n      id\n      name\n      trainLine\n      description\n      active\n      createdAt\n      updatedAt\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;