/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: { input: any; output: any; }
};

export type Area = {
  __typename?: 'Area';
  areaName: Scalars['String']['output'];
  createdAt: Scalars['ISO8601DateTime']['output'];
  district: District;
  districtId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  stores: Array<Store>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['ISO8601DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type District = {
  __typename?: 'District';
  areas: Array<Area>;
  createdAt: Scalars['ISO8601DateTime']['output'];
  districtName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  stores: Array<Store>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Hashtag = {
  __typename?: 'Hashtag';
  createdAt: Scalars['ISO8601DateTime']['output'];
  hashtagName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  stores: Array<Store>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type InstagramEmbed = {
  __typename?: 'InstagramEmbed';
  createdAt: Scalars['ISO8601DateTime']['output'];
  embedCode: Scalars['String']['output'];
  embedUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instagramEmbedName: Scalars['String']['output'];
  stores: Array<Store>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Menu = {
  __typename?: 'Menu';
  createdAt: Scalars['ISO8601DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  menuName: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  stores: Array<Store>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** An example field added by the generator */
  testField: Scalars['String']['output'];
};

export type OpeningHour = {
  __typename?: 'OpeningHour';
  closeTime: Scalars['ISO8601DateTime']['output'];
  createdAt: Scalars['ISO8601DateTime']['output'];
  dayOfWeek: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  openTime: Scalars['ISO8601DateTime']['output'];
  store: Store;
  storeId: Scalars['Int']['output'];
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Purpose = {
  __typename?: 'Purpose';
  createdAt: Scalars['ISO8601DateTime']['output'];
  id: Scalars['ID']['output'];
  purposeName: Scalars['String']['output'];
  stores: Array<Store>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  area?: Maybe<Area>;
  areas: Array<Area>;
  categories: Array<Category>;
  district?: Maybe<District>;
  districts: Array<District>;
  hashtags: Array<Hashtag>;
  purposes: Array<Purpose>;
  store?: Maybe<Store>;
  storeAmbiances: Array<StoreAmbiance>;
  stores: Array<Store>;
};


export type QueryAreaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDistrictArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoreArgs = {
  id: Scalars['ID']['input'];
};

export type Store = {
  __typename?: 'Store';
  address?: Maybe<Scalars['String']['output']>;
  areas: Array<Area>;
  budgetRange?: Maybe<Scalars['String']['output']>;
  catchphrase?: Maybe<Scalars['String']['output']>;
  categories: Array<Category>;
  createdAt: Scalars['ISO8601DateTime']['output'];
  district: District;
  districtId: Scalars['Int']['output'];
  hashtags: Array<Hashtag>;
  id: Scalars['ID']['output'];
  instagramEmbeds: Array<InstagramEmbed>;
  instagramUrl?: Maybe<Scalars['String']['output']>;
  isClosed?: Maybe<Scalars['Boolean']['output']>;
  isRainyOk?: Maybe<Scalars['Boolean']['output']>;
  maxPeople?: Maybe<Scalars['Int']['output']>;
  menus: Array<Menu>;
  minPeople?: Maybe<Scalars['Int']['output']>;
  nearestStation?: Maybe<Scalars['String']['output']>;
  openingHours: Array<OpeningHour>;
  parkingAvailable?: Maybe<Scalars['Boolean']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  purposes: Array<Purpose>;
  recommendedFor1?: Maybe<Scalars['String']['output']>;
  recommendedFor2?: Maybe<Scalars['String']['output']>;
  reviewCount?: Maybe<Scalars['Int']['output']>;
  reviewRating?: Maybe<Scalars['Float']['output']>;
  storeAmbiances: Array<StoreAmbiance>;
  storeName: Scalars['String']['output'];
  theme?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type StoreAmbiance = {
  __typename?: 'StoreAmbiance';
  ambianceName: Scalars['String']['output'];
  createdAt: Scalars['ISO8601DateTime']['output'];
  id: Scalars['ID']['output'];
  stores: Array<Store>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type GetAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAreasQuery = { __typename?: 'Query', areas: Array<{ __typename?: 'Area', id: string, areaName: string, district: { __typename?: 'District', id: string, districtName: string } }> };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, createdAt: any, updatedAt: any }> };

export type GetDistrictsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDistrictsQuery = { __typename?: 'Query', districts: Array<{ __typename?: 'District', id: string, districtName: string }> };

export type GetHashtagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHashtagsQuery = { __typename?: 'Query', hashtags: Array<{ __typename?: 'Hashtag', id: string, hashtagName: string }> };

export type GetPurposesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPurposesQuery = { __typename?: 'Query', purposes: Array<{ __typename?: 'Purpose', id: string, purposeName: string }> };

export type GetStoreQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStoreQuery = { __typename?: 'Query', store?: { __typename?: 'Store', id: string, storeName: string, address?: string | null, phoneNumber?: string | null, website?: string | null, catchphrase?: string | null, recommendedFor1?: string | null, recommendedFor2?: string | null, parkingAvailable?: boolean | null, nearestStation?: string | null, reviewRating?: number | null, reviewCount?: number | null, instagramUrl?: string | null, isClosed?: boolean | null, budgetRange?: string | null, maxPeople?: number | null, minPeople?: number | null, isRainyOk?: boolean | null, theme?: string | null, district: { __typename?: 'District', id: string, districtName: string }, areas: Array<{ __typename?: 'Area', id: string, areaName: string }>, categories: Array<{ __typename?: 'Category', id: string, name: string }>, hashtags: Array<{ __typename?: 'Hashtag', id: string, hashtagName: string }>, openingHours: Array<{ __typename?: 'OpeningHour', id: string, dayOfWeek: string, openTime: any, closeTime: any }>, instagramEmbeds: Array<{ __typename?: 'InstagramEmbed', id: string, instagramEmbedName: string, embedCode: string, embedUrl: string }>, menus: Array<{ __typename?: 'Menu', id: string, menuName: string, price?: number | null, description?: string | null }>, storeAmbiances: Array<{ __typename?: 'StoreAmbiance', id: string, ambianceName: string }>, purposes: Array<{ __typename?: 'Purpose', id: string, purposeName: string }> } | null };

export type GetStoreAmbiancesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStoreAmbiancesQuery = { __typename?: 'Query', storeAmbiances: Array<{ __typename?: 'StoreAmbiance', id: string, ambianceName: string }> };

export type GetStoresQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStoresQuery = { __typename?: 'Query', stores: Array<{ __typename?: 'Store', id: string, storeName: string, address?: string | null, catchphrase?: string | null, parkingAvailable?: boolean | null, reviewRating?: number | null, reviewCount?: number | null, budgetRange?: string | null, theme?: string | null, district: { __typename?: 'District', id: string, districtName: string }, areas: Array<{ __typename?: 'Area', id: string, areaName: string }>, categories: Array<{ __typename?: 'Category', id: string, name: string }>, hashtags: Array<{ __typename?: 'Hashtag', id: string, hashtagName: string }> }> };


export const GetAreasDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetAreas" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "areas" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "areaName" } }, { "kind": "Field", "name": { "kind": "Name", "value": "district" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "districtName" } }] } }] } }] } }] } as unknown as DocumentNode<GetAreasQuery, GetAreasQueryVariables>;
export const CategoriesDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "Categories" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "categories" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "createdAt" } }, { "kind": "Field", "name": { "kind": "Name", "value": "updatedAt" } }] } }] } }] } as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const GetDistrictsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetDistricts" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "districts" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "districtName" } }] } }] } }] } as unknown as DocumentNode<GetDistrictsQuery, GetDistrictsQueryVariables>;
export const GetHashtagsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetHashtags" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "hashtags" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "hashtagName" } }] } }] } }] } as unknown as DocumentNode<GetHashtagsQuery, GetHashtagsQueryVariables>;
export const GetPurposesDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetPurposes" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "purposes" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "purposeName" } }] } }] } }] } as unknown as DocumentNode<GetPurposesQuery, GetPurposesQueryVariables>;
export const GetStoreDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetStore" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "ID" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "store" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "id" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "storeName" } }, { "kind": "Field", "name": { "kind": "Name", "value": "address" } }, { "kind": "Field", "name": { "kind": "Name", "value": "phoneNumber" } }, { "kind": "Field", "name": { "kind": "Name", "value": "website" } }, { "kind": "Field", "name": { "kind": "Name", "value": "catchphrase" } }, { "kind": "Field", "name": { "kind": "Name", "value": "recommendedFor1" } }, { "kind": "Field", "name": { "kind": "Name", "value": "recommendedFor2" } }, { "kind": "Field", "name": { "kind": "Name", "value": "parkingAvailable" } }, { "kind": "Field", "name": { "kind": "Name", "value": "nearestStation" } }, { "kind": "Field", "name": { "kind": "Name", "value": "reviewRating" } }, { "kind": "Field", "name": { "kind": "Name", "value": "reviewCount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "instagramUrl" } }, { "kind": "Field", "name": { "kind": "Name", "value": "isClosed" } }, { "kind": "Field", "name": { "kind": "Name", "value": "budgetRange" } }, { "kind": "Field", "name": { "kind": "Name", "value": "maxPeople" } }, { "kind": "Field", "name": { "kind": "Name", "value": "minPeople" } }, { "kind": "Field", "name": { "kind": "Name", "value": "isRainyOk" } }, { "kind": "Field", "name": { "kind": "Name", "value": "theme" } }, { "kind": "Field", "name": { "kind": "Name", "value": "district" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "districtName" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "areas" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "areaName" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "categories" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "hashtags" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "hashtagName" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "openingHours" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "dayOfWeek" } }, { "kind": "Field", "name": { "kind": "Name", "value": "openTime" } }, { "kind": "Field", "name": { "kind": "Name", "value": "closeTime" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "instagramEmbeds" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "instagramEmbedName" } }, { "kind": "Field", "name": { "kind": "Name", "value": "embedCode" } }, { "kind": "Field", "name": { "kind": "Name", "value": "embedUrl" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "menus" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "menuName" } }, { "kind": "Field", "name": { "kind": "Name", "value": "price" } }, { "kind": "Field", "name": { "kind": "Name", "value": "description" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "storeAmbiances" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "ambianceName" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "purposes" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "purposeName" } }] } }] } }] } }] } as unknown as DocumentNode<GetStoreQuery, GetStoreQueryVariables>;
export const GetStoreAmbiancesDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetStoreAmbiances" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "storeAmbiances" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "ambianceName" } }] } }] } }] } as unknown as DocumentNode<GetStoreAmbiancesQuery, GetStoreAmbiancesQueryVariables>;
export const GetStoresDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetStores" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "stores" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "storeName" } }, { "kind": "Field", "name": { "kind": "Name", "value": "address" } }, { "kind": "Field", "name": { "kind": "Name", "value": "catchphrase" } }, { "kind": "Field", "name": { "kind": "Name", "value": "parkingAvailable" } }, { "kind": "Field", "name": { "kind": "Name", "value": "reviewRating" } }, { "kind": "Field", "name": { "kind": "Name", "value": "reviewCount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "budgetRange" } }, { "kind": "Field", "name": { "kind": "Name", "value": "theme" } }, { "kind": "Field", "name": { "kind": "Name", "value": "district" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "districtName" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "areas" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "areaName" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "categories" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "hashtags" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "hashtagName" } }] } }] } }] } }] } as unknown as DocumentNode<GetStoresQuery, GetStoresQueryVariables>;