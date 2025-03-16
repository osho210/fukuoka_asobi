export interface Spot {
  id: string;
  spotName: string;
  address?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  catchphrase?: string | null;
  recommendedFor1?: string | null;
  recommendedFor2?: string | null;
  parkingAvailable?: boolean | null;
  nearestStation?: string | null;
  reviewRating?: number | null;
  reviewCount?: number | null;
  instagramUrl?: string | null;
  isClosed?: boolean | null;
  budgetRange?: string | null;
  maxPeople?: number | null;
  minPeople?: number | null;
  isRainyOk?: boolean | null;
  theme?: string | null;
  imageUrl?: string | null;
  spotType: 'STORE' | 'TOURIST_SPOT' | 'ACTIVITY';
  district: {
    id: string;
    districtName: string;
  };
  areas: Array<{
    id: string;
    areaName: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
  hashtags: Array<{
    id: string;
    hashtagName: string;
  }>;
  openingHours: Array<{
    id: string;
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
  }>;
  instagramEmbeds: Array<{
    id: string;
    instagramEmbedName: string;
    embedCode?: string | null;
    embedUrl?: string | null;
  }>;
  menus: Array<{
    id: string;
    menuName: string;
    price?: number | null;
    description?: string | null;
  }>;
  spotAmbiances: Array<{
    id: string;
    ambianceName: string;
  }>;
  purposes: Array<{
    id: string;
    purposeName: string;
  }>;
}

export interface District {
  id: string;
  district_name: string;
}

export interface Area {
  id: string;
  areaName: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Hashtag {
  id: string;
  hashtagName: string;
}

export interface OpeningHour {
  id: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

export interface Menu {
  id: string;
  menuName: string;
  price: number | null;
  description: string | null;
}

export interface SpotAmbiance {
  id: string;
  ambianceName: string;
}

export interface Purpose {
  id: string;
  purposeName: string;
}