import type { Meta, StoryObj } from '@storybook/react';
import { GET_SPOT } from '@/graphql/queries/getSpot';
import SpotDetailContainer from './spot-detail.container';

// モックスポットデータ
const mockSpot = {
  id: '1',
  spotName: '博多屋台街',
  address: '福岡市博多区中洲',
  district: { id: '1', districtName: '博多区' },
  districtId: '1',
  phoneNumber: '092-XXX-XXXX',
  website: 'https://example.com',
  catchphrase: '博多の夜を楽しむなら',
  isRainyOk: false,
  budgetRange: '1000-3000',
  spotType: 'グルメ',
  theme: '屋台',
  reviewRating: 4.5,
  reviewCount: 350,
  instagramUrl: 'https://instagram.com/example',
  isClosed: false,
  maxPeople: 10,
  minPeople: 1,
  recommendedFor1: 'カップル',
  recommendedFor2: '友達同士',
  nearestStation: '中洲川端駅',
  parkingAvailable: false,
  googlePlaceId: 'ChIJxxxxx',
  latitude: 33.5904,
  longitude: 130.4017,
  businessStatus: 'OPERATIONAL',
  priceLevel: 'MODERATE',
  primaryType: 'restaurant',
  primaryTypeDisplayName: 'レストラン',
  internationalPhoneNumber: '+81-92-XXX-XXXX',
  shortFormattedAddress: '中洲, 博多区',
  googleMapsUri: 'https://maps.google.com',
  takeout: true,
  delivery: false,
  dineIn: true,
  reservable: true,
  servesBreakfast: false,
  servesLunch: true,
  servesDinner: true,
  servesBrunch: false,
  servesBeer: true,
  servesWine: true,
  servesVegetarianFood: false,
  outdoorSeating: true,
  liveMusic: false,
  menuForChildren: false,
  servesCocktails: true,
  servesDessert: false,
  servesCoffee: false,
  goodForChildren: false,
  allowsDogs: false,
  restroom: true,
  goodForGroups: true,
  goodForWatchingSports: false,
  acceptsCreditCards: true,
  acceptsDebitCards: true,
  acceptsCashOnly: false,
  acceptsNfc: true,
  freeParkingLot: false,
  paidParkingLot: true,
  freeStreetParking: false,
  paidStreetParking: false,
  valetParking: false,
  freeGarageParking: false,
  paidGarageParking: false,
  googleTypes: '["restaurant", "food"]',
  adrFormatAddress: '<span>博多区中洲</span>',
  generativeSummary: '博多の夜を代表する屋台街です。',
  editorialSummary: '博多グルメを堪能できる人気スポット。',
  priceRangeStartAmount: 1000,
  priceRangeEndAmount: 3000,
  priceRange: {
    startPrice: { amount: 1000, currency: 'JPY' },
    endPrice: { amount: 3000, currency: 'JPY' },
  },
  reviewSummary: {
    text: '美味しい屋台がたくさん',
    flagContentUri: null,
    disclosureText: null,
    reviewsUri: null,
  },
  openingHours: [
    { id: '1', dayOfWeek: '月', openTime: '18:00', closeTime: '24:00', isClosedDay: false },
    { id: '2', dayOfWeek: '火', openTime: '18:00', closeTime: '24:00', isClosedDay: false },
    { id: '3', dayOfWeek: '水', openTime: '18:00', closeTime: '24:00', isClosedDay: false },
    { id: '4', dayOfWeek: '木', openTime: '18:00', closeTime: '24:00', isClosedDay: false },
    { id: '5', dayOfWeek: '金', openTime: '18:00', closeTime: '24:00', isClosedDay: false },
    { id: '6', dayOfWeek: '土', openTime: '18:00', closeTime: '24:00', isClosedDay: false },
    { id: '7', dayOfWeek: '日', openTime: null, closeTime: null, isClosedDay: true },
  ],
  hashtags: [{ id: '1', hashtagName: '屋台' }, { id: '2', hashtagName: '博多グルメ' }],
  purposes: [{ id: '1', purposeName: '食事' }],
  spotAmbiances: [{ id: '1', ambianceName: '賑やか' }],
  categories: [{ id: '1', name: 'グルメ' }],
  menus: [],
  areas: [{ id: '1', areaName: '中洲' }],
  spotMagazines: [],
  magazines: [],
  imageUrls: [{ id: '1', url: '/itoshima.png' }],
  imageUrl: { id: '1', url: '/itoshima.png' },
};

const spotMocks = [
  {
    request: {
      query: GET_SPOT,
      variables: { id: '1' },
    },
    result: {
      data: { spot: mockSpot },
    },
  },
  {
    request: {
      query: GET_SPOT,
      variables: { id: '2' },
    },
    result: {
      data: {
        spot: {
          ...mockSpot,
          id: '2',
          spotName: '大濠公園',
          address: '福岡市中央区大濠公園',
          catchphrase: '都会のオアシス',
          spotType: '公園',
          district: { id: '2', districtName: '中央区' },
        },
      },
    },
  },
];

const meta = {
  title: 'Pages/Frontend/Spots/Detail',
  component: SpotDetailContainer,
  parameters: {
    layout: 'fullscreen',
    apolloMocks: spotMocks,
  },
  tags: ['autodocs'],
  argTypes: {
    spotId: {
      control: 'text',
      description: 'スポットID',
    },
  },
} satisfies Meta<typeof SpotDetailContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * スポット詳細ページの基本的な表示状態
 */
export const Default: Story = {
  args: {
    spotId: '1',
  },
};

/**
 * 別のスポット
 */
export const Spot2: Story = {
  args: {
    spotId: '2',
  },
};

/**
 * ローディング状態
 */
export const Loading: Story = {
  args: {
    spotId: '1',
  },
  parameters: {
    apolloMocks: [
      {
        ...spotMocks[0],
        delay: 100000,
      },
    ],
  },
};
