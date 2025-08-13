// プラン関連の共通型定義

export interface OpeningHour {
  id: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

export interface OpeningHourList {
  dayOfWeek: string;
  businessHour: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface District {
  id: string;
  districtName: string;
}

export interface Spot {
  id: string;
  spotName: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
  catchphrase?: string;
  reviewRating?: number;
  reviewCount?: number;
  instagramUrl?: string;
  budgetRange?: string;
  imageUrl?: string;
  imageUrls?: string[];
  theme?: string;
  isRainyOk?: boolean;
  district?: District;
  categories?: Category[];
  openingHours?: OpeningHour[];
  openingHourList?: OpeningHourList[];
  closedDays?: string[];
}

export interface PlanDetail {
  id: string;
  stepNumber: number;
  stepName: string;
  stepDescription?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  startTime?: string;
  durationMinutes?: number;
  budget?: number;
  notes?: string;
  plannerTitle?: string;
  plannerDescription?: string;
  spot?: Spot;
  travelDetails?: TravelDetail[];
}

export interface User {
  id: string;
  username: string;
  profileImageUrl?: string;
  role: string;
}

export interface RecommendedFor {
  id: string;
  name: string;
}

export interface PlayPlan {
  id: string;
  planName: string;
  description?: string;
  imageUrls?: { id: number, url: string; }[];
  location?: string;
  tripType: string;
  totalBudget?: number;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  isFavorite?: boolean;
  status: string;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string;
  recommendedFors?: RecommendedFor[];
  recommendUsers?: string;
  plannerTitle?: string;
  plannerDescription?: string;
  user?: User;
  userId?: number;
  planDetails: PlanDetail[];
}

export interface TravelDetail {
  sequenceNumber: number;
  travelMethod: string;
  travelTime: number;
}

export interface TravelSegment {
  fromSpot: {
    id: string;
    spotName: string;
  };
  toSpot: {
    id: string;
    spotName: string;
  };
  distance: number;
  travelTime: number;
  travelMethod: string;
}

export interface TravelRoute {
  totalDistance: number;
  totalTravelTime: number;
  travelSegments: TravelSegment[];
}

export interface GeneratedPlan {
  id: string;
  planName: string;
  description: string;
  totalBudget: number;
  startDatetime: string;
  endDatetime: string;
  planDetails: PlanDetail[];
  travelRoute: TravelRoute;
}
