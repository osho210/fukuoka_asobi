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

export interface StoreAmbiance {
  id: string;
  ambianceName: string;
}

export interface Purpose {
  id: string;
  purposeName: string;
}

export interface Store {
  id: string;
  storeName: string;
  address: string | null;
  catchphrase: string | null;
  phoneNumber: string | null;
  website: string | null;
  recommendedFor1: string | null;
  recommendedFor2: string | null;
  parkingAvailable: boolean | null;
  nearestStation: string | null;
  reviewRating: number | null;
  reviewCount: number | null;
  instagramUrl: string | null;
  isClosed: boolean | null;
  budgetRange: string | null;
  maxPeople: number | null;
  minPeople: number | null;
  isRainyOk: boolean | null;
  theme: string | null;
  district: District;
  areas: Area[];
  categories: Category[];
  hashtags: Hashtag[];
  openingHours: OpeningHour[];
  menus: Menu[];
  storeAmbiances: StoreAmbiance[];
  purposes: Purpose[];
}
