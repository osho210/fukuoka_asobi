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
  ISO8601Date: { input: any; output: any; }
  ISO8601DateTime: { input: any; output: any; }
};

export type Area = {
  __typename?: 'Area';
  areaName: Scalars['String']['output'];
  createdAt: Scalars['ISO8601DateTime']['output'];
  district: District;
  districtId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  spots: Array<Spot>;
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
  spots: Array<Spot>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Event = {
  __typename?: 'Event';
  bannerImage?: Maybe<Scalars['String']['output']>;
  capacity?: Maybe<Scalars['Int']['output']>;
  contactEmail?: Maybe<Scalars['String']['output']>;
  contactPhone?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['ISO8601DateTime']['output'];
  description: Scalars['String']['output'];
  endDatetime: Scalars['ISO8601DateTime']['output'];
  eventCategory: EventCategory;
  eventCategoryId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isOnline: Scalars['Boolean']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  location: Scalars['String']['output'];
  longitude?: Maybe<Scalars['Float']['output']>;
  organizer?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  recurringRule?: Maybe<Scalars['String']['output']>;
  sourceUrl?: Maybe<Scalars['String']['output']>;
  startDatetime: Scalars['ISO8601DateTime']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type EventCategory = {
  __typename?: 'EventCategory';
  createdAt: Scalars['ISO8601DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  events?: Maybe<Array<Event>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Hashtag = {
  __typename?: 'Hashtag';
  createdAt: Scalars['ISO8601DateTime']['output'];
  hashtagName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  spots: Array<Spot>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type InstagramEmbed = {
  __typename?: 'InstagramEmbed';
  createdAt: Scalars['ISO8601DateTime']['output'];
  embedCode: Scalars['String']['output'];
  embedUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instagramEmbedName: Scalars['String']['output'];
  spots: Array<Spot>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Menu = {
  __typename?: 'Menu';
  createdAt: Scalars['ISO8601DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  menuName: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  spots: Array<Spot>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** An example field added by the generator */
  testField: Scalars['String']['output'];
};

export type News = {
  __typename?: 'News';
  author?: Maybe<User>;
  body: Scalars['String']['output'];
  category?: Maybe<Category>;
  createdAt: Scalars['ISO8601DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['ISO8601DateTime']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

/** An object with an ID. */
export type Node = {
  /** ID of the object. */
  id: Scalars['ID']['output'];
};

export type OpeningHour = {
  __typename?: 'OpeningHour';
  closeTime: Scalars['ISO8601DateTime']['output'];
  createdAt: Scalars['ISO8601DateTime']['output'];
  dayOfWeek: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  openTime: Scalars['ISO8601DateTime']['output'];
  spot: Spot;
  spotId: Scalars['Int']['output'];
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type OpeningHourList = {
  __typename?: 'OpeningHourList';
  businessHour: Scalars['String']['output'];
  dayOfWeek: Scalars['String']['output'];
};

export type PlanDetail = Node & {
  __typename?: 'PlanDetail';
  budget?: Maybe<Scalars['Float']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['ISO8601DateTime']['output'];
  endDatetime?: Maybe<Scalars['ISO8601DateTime']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  planId: Scalars['Int']['output'];
  plannerDescription?: Maybe<Scalars['String']['output']>;
  plannerTitle?: Maybe<Scalars['String']['output']>;
  playPlan: PlayPlan;
  spot?: Maybe<Spot>;
  spotId?: Maybe<Scalars['Int']['output']>;
  startDatetime?: Maybe<Scalars['ISO8601DateTime']['output']>;
  stepDescription?: Maybe<Scalars['String']['output']>;
  stepName: Scalars['String']['output'];
  stepNumber: Scalars['Int']['output'];
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type PlayPlan = {
  __typename?: 'PlayPlan';
  createdAt: Scalars['ISO8601DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDatetime?: Maybe<Scalars['ISO8601DateTime']['output']>;
  favoriteCount: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  planDetails?: Maybe<Array<PlanDetail>>;
  planName: Scalars['String']['output'];
  plannerDescription?: Maybe<Scalars['String']['output']>;
  plannerTitle?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['ISO8601DateTime']['output']>;
  rating: Scalars['Float']['output'];
  recommendedForString?: Maybe<Scalars['String']['output']>;
  recommendedFors?: Maybe<Array<RecommendedFor>>;
  reviewCount: Scalars['Int']['output'];
  startDatetime?: Maybe<Scalars['ISO8601DateTime']['output']>;
  status: PlayPlanStatusEnum;
  tags?: Maybe<Scalars['String']['output']>;
  totalBudget?: Maybe<Scalars['Float']['output']>;
  tripType: TripTypeEnum;
  updatedAt: Scalars['ISO8601DateTime']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['Int']['output']>;
};

/** プランのステータス */
export enum PlayPlanStatusEnum {
  /** 下書き */
  Draft = 'DRAFT',
  /** 公開 */
  Published = 'PUBLISHED'
}

export type Purpose = {
  __typename?: 'Purpose';
  createdAt: Scalars['ISO8601DateTime']['output'];
  id: Scalars['ID']['output'];
  purposeName: Scalars['String']['output'];
  spots: Array<Spot>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  area?: Maybe<Area>;
  areas: Array<Area>;
  categories: Array<Category>;
  district?: Maybe<District>;
  districts: Array<District>;
  event?: Maybe<Event>;
  eventCategories: Array<EventCategory>;
  eventCategory?: Maybe<EventCategory>;
  events: Array<Event>;
  hashtags: Array<Hashtag>;
  news: Array<News>;
  newsDetail?: Maybe<News>;
  playPlan?: Maybe<PlayPlan>;
  playPlans: Array<PlayPlan>;
  purposes: Array<Purpose>;
  spot?: Maybe<Spot>;
  spotAmbiances: Array<SpotAmbiance>;
  spots: Array<Spot>;
};


export type QueryAreaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDistrictArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventsArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  isOnline?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  upcoming?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryNewsArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNewsDetailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlayPlanArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPlayPlansArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<PlayPlanStatusEnum>;
};


export type QuerySpotArgs = {
  id: Scalars['ID']['input'];
};

export type RecommendedFor = {
  __typename?: 'RecommendedFor';
  createdAt: Scalars['ISO8601DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type Spot = {
  __typename?: 'Spot';
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
  imageUrl?: Maybe<Scalars['String']['output']>;
  instagramEmbeds: Array<InstagramEmbed>;
  instagramUrl?: Maybe<Scalars['String']['output']>;
  isClosed?: Maybe<Scalars['Boolean']['output']>;
  isRainyOk?: Maybe<Scalars['Boolean']['output']>;
  maxPeople?: Maybe<Scalars['Int']['output']>;
  menus: Array<Menu>;
  minPeople?: Maybe<Scalars['Int']['output']>;
  nearestStation?: Maybe<Scalars['String']['output']>;
  /** 営業時間のリスト（曜日と営業時間） */
  openingHourList: Array<OpeningHourList>;
  openingHours: Array<OpeningHour>;
  parkingAvailable?: Maybe<Scalars['Boolean']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  purposes: Array<Purpose>;
  recommendedFor1?: Maybe<Scalars['String']['output']>;
  recommendedFor2?: Maybe<Scalars['String']['output']>;
  reviewCount?: Maybe<Scalars['Int']['output']>;
  reviewRating?: Maybe<Scalars['Float']['output']>;
  spotAmbiances: Array<SpotAmbiance>;
  spotName: Scalars['String']['output'];
  spotType: SpotTypeEnum;
  theme?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type SpotAmbiance = {
  __typename?: 'SpotAmbiance';
  ambianceName: Scalars['String']['output'];
  createdAt: Scalars['ISO8601DateTime']['output'];
  id: Scalars['ID']['output'];
  spots: Array<Spot>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

/** スポットの種類を表す列挙型 */
export enum SpotTypeEnum {
  /** アクティビティ */
  Activity = 'ACTIVITY',
  /** 店舗 */
  Store = 'STORE',
  /** 観光スポット */
  TouristSpot = 'TOURIST_SPOT'
}

/** 旅行タイプ */
export enum TripTypeEnum {
  /** 日帰り */
  DayTrip = 'DAY_TRIP',
  /** 泊まり */
  Overnight = 'OVERNIGHT'
}

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['ISO8601DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instagramUrl?: Maybe<Scalars['String']['output']>;
  isPaidMember?: Maybe<Scalars['Boolean']['output']>;
  paidEndDate?: Maybe<Scalars['ISO8601Date']['output']>;
  paidStartDate?: Maybe<Scalars['ISO8601Date']['output']>;
  passwordHash?: Maybe<Scalars['String']['output']>;
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
  username: Scalars['String']['output'];
};

export type GetPlayPlanQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPlayPlanQuery = { __typename?: 'Query', playPlan?: { __typename?: 'PlayPlan', id: number, planName: string, description?: string | null, imageUrl?: string | null, location?: string | null, tripType: TripTypeEnum, totalBudget?: number | null, rating: number, reviewCount: number, favoriteCount: number, status: PlayPlanStatusEnum, startDatetime?: any | null, endDatetime?: any | null, tags?: string | null, createdAt: any, updatedAt: any, plannerTitle?: string | null, plannerDescription?: string | null, recommendedFors?: Array<{ __typename?: 'RecommendedFor', id: string, name: string }> | null, user?: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null, role?: string | null } | null, planDetails?: Array<{ __typename?: 'PlanDetail', id: string, stepNumber: number, stepName: string, stepDescription?: string | null, comment?: string | null, startDatetime?: any | null, endDatetime?: any | null, budget?: number | null, notes?: string | null, plannerTitle?: string | null, plannerDescription?: string | null, spot?: { __typename?: 'Spot', id: string, spotName: string, address?: string | null, phoneNumber?: string | null, website?: string | null, catchphrase?: string | null, reviewRating?: number | null, reviewCount?: number | null, instagramUrl?: string | null, budgetRange?: string | null, imageUrl?: string | null, theme?: string | null, isRainyOk?: boolean | null, district: { __typename?: 'District', id: string, districtName: string }, categories: Array<{ __typename?: 'Category', id: string, name: string }>, openingHours: Array<{ __typename?: 'OpeningHour', id: string, dayOfWeek: string, openTime: any, closeTime: any }>, openingHourList: Array<{ __typename?: 'OpeningHourList', dayOfWeek: string, businessHour: string }> } | null }> | null } | null };

export type GetPlayPlansQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPlayPlansQuery = { __typename?: 'Query', playPlans: Array<{ __typename?: 'PlayPlan', id: number, planName: string, description?: string | null, imageUrl?: string | null, location?: string | null, tripType: TripTypeEnum, totalBudget?: number | null, rating: number, reviewCount: number, favoriteCount: number, status: PlayPlanStatusEnum, user?: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null, role?: string | null } | null }> };

export type GetRecommendedEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecommendedEventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: string, title: string, location: string, startDatetime: any, endDatetime: any, bannerImage?: string | null, isOnline: boolean, eventCategory: { __typename?: 'EventCategory', id: string, name: string } }> };

export type GetRecommendedSpotsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecommendedSpotsQuery = { __typename?: 'Query', spots: Array<{ __typename?: 'Spot', id: string, spotName: string, spotType: SpotTypeEnum, address?: string | null, reviewRating?: number | null, reviewCount?: number | null, imageUrl?: string | null, district: { __typename?: 'District', districtName: string }, categories: Array<{ __typename?: 'Category', name: string }> }> };

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

export type GetSpotQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSpotQuery = { __typename?: 'Query', spot?: { __typename?: 'Spot', id: string, spotName: string, address?: string | null, phoneNumber?: string | null, website?: string | null, catchphrase?: string | null, recommendedFor1?: string | null, recommendedFor2?: string | null, parkingAvailable?: boolean | null, nearestStation?: string | null, reviewRating?: number | null, reviewCount?: number | null, instagramUrl?: string | null, isClosed?: boolean | null, budgetRange?: string | null, maxPeople?: number | null, minPeople?: number | null, isRainyOk?: boolean | null, theme?: string | null, spotType: SpotTypeEnum, openingHourList: Array<{ __typename?: 'OpeningHourList', dayOfWeek: string, businessHour: string }>, district: { __typename?: 'District', id: string, districtName: string }, areas: Array<{ __typename?: 'Area', id: string, areaName: string }>, categories: Array<{ __typename?: 'Category', id: string, name: string }>, hashtags: Array<{ __typename?: 'Hashtag', id: string, hashtagName: string }>, openingHours: Array<{ __typename?: 'OpeningHour', id: string, dayOfWeek: string, openTime: any, closeTime: any }>, instagramEmbeds: Array<{ __typename?: 'InstagramEmbed', id: string, instagramEmbedName: string, embedCode: string, embedUrl: string }>, menus: Array<{ __typename?: 'Menu', id: string, menuName: string, price?: number | null, description?: string | null }>, spotAmbiances: Array<{ __typename?: 'SpotAmbiance', id: string, ambianceName: string }>, purposes: Array<{ __typename?: 'Purpose', id: string, purposeName: string }> } | null };

export type GetSpotAmbiancesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpotAmbiancesQuery = { __typename?: 'Query', spotAmbiances: Array<{ __typename?: 'SpotAmbiance', id: string, ambianceName: string }> };

export type GetSpotsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpotsQuery = { __typename?: 'Query', spots: Array<{ __typename?: 'Spot', id: string, spotName: string, address?: string | null, catchphrase?: string | null, parkingAvailable?: boolean | null, reviewRating?: number | null, reviewCount?: number | null, budgetRange?: string | null, theme?: string | null, district: { __typename?: 'District', id: string, districtName: string }, areas: Array<{ __typename?: 'Area', id: string, areaName: string }>, categories: Array<{ __typename?: 'Category', id: string, name: string }>, hashtags: Array<{ __typename?: 'Hashtag', id: string, hashtagName: string }> }> };
