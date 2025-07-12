'use client';

import React, { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const SEARCH_GOOGLE_PLACES = gql`
  query SearchGooglePlaces($query: String!, $latitude: Float, $longitude: Float, $radius: Int) {
    searchGooglePlaces(query: $query, latitude: $latitude, longitude: $longitude, radius: $radius) {
      placeId
      name
      formattedAddress
      shortFormattedAddress
      rating
      userRatingCount
      types
      primaryType
      primaryTypeDisplayName
      businessStatus
      priceLevel
      location {
        latitude
        longitude
      }
      googleMapsUri
      websiteUri
      nationalPhoneNumber
      internationalPhoneNumber
      regularOpeningHours {
        openNow
        periods {
          open { day, hour, minute }
          close { day, hour, minute }
        }
        weekdayDescriptions
      }
      paymentOptions {
        acceptsCreditCards
        acceptsDebitCards
        acceptsCashOnly
        acceptsNfc
      }
      parkingOptions {
        freeParkingLot
        paidParkingLot
        freeStreetParking
        paidStreetParking
        valetParking
        freeGarageParking
        paidGarageParking
      }
      servesBreakfast
      servesLunch
      servesDinner
      servesBeer
      servesWine
      servesBrunch
      servesCocktails
      servesDessert
      servesCoffee
      takeout
      delivery
      dineIn
      curbsidePickup
      reservable
      outdoorSeating
      liveMusic
      menuForChildren
      goodForChildren
      allowsDogs
      restroom
      goodForGroups
      goodForWatchingSports
    }
  }
`;

const SYNC_SPOT_WITH_GOOGLE_PLACES = gql`
  mutation SyncSpotWithGooglePlaces($input: SyncSpotWithGooglePlacesInput!) {
    syncSpotWithGooglePlaces(input: $input) {
      success
      spot {
        id
        spotName
        googlePlaceId
        latitude
        longitude
        address
        phoneNumber
        website
        reviewRating
        reviewCount
        businessStatus
        priceLevel
        lastApiSyncAt
        apiSyncStatus
      }
      errors
    }
  }
`;

interface OpeningHoursPeriod {
  open: {
    day: number;
    hour: number;
    minute: number;
  };
  close: {
    day: number;
    hour: number;
    minute: number;
  };
}

interface OpeningHours {
  openNow: boolean;
  periods: OpeningHoursPeriod[];
  weekdayDescriptions: string[];
}

interface PaymentOptions {
  acceptsCreditCards?: boolean;
  acceptsDebitCards?: boolean;
  acceptsCashOnly?: boolean;
  acceptsNfc?: boolean;
}

interface ParkingOptions {
  freeParkingLot?: boolean;
  paidParkingLot?: boolean;
  freeStreetParking?: boolean;
  paidStreetParking?: boolean;
  valetParking?: boolean;
  freeGarageParking?: boolean;
  paidGarageParking?: boolean;
}

export interface GooglePlace {
  placeId: string;
  name: string;
  formattedAddress: string;
  shortFormattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  primaryType?: string;
  primaryTypeDisplayName?: string;
  businessStatus?: string;
  priceLevel?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  googleMapsUri?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  regularOpeningHours?: OpeningHours;
  currentOpeningHours?: OpeningHours;
  paymentOptions?: PaymentOptions;
  parkingOptions?: ParkingOptions;
  servesBreakfast?: boolean;
  servesLunch?: boolean;
  servesDinner?: boolean;
  servesBeer?: boolean;
  servesWine?: boolean;
  servesBrunch?: boolean;
  servesCocktails?: boolean;
  servesDessert?: boolean;
  servesCoffee?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  dineIn?: boolean;
  curbsidePickup?: boolean;
  reservable?: boolean;
  outdoorSeating?: boolean;
  liveMusic?: boolean;
  menuForChildren?: boolean;
  goodForChildren?: boolean;
  allowsDogs?: boolean;
  restroom?: boolean;
  goodForGroups?: boolean;
  goodForWatchingSports?: boolean;
}

export interface SyncedSpot {
  id: string;
  spotName: string;
  googlePlaceId?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  phoneNumber?: string;
  website?: string;
  reviewRating?: number;
  reviewCount?: number;
  businessStatus?: string;
  priceLevel?: string;
  lastApiSyncAt?: string;
  apiSyncStatus?: string;
}

interface GooglePlacesSearchProps {
  spotId?: string;
  onPlaceSelect?: (place: GooglePlace) => void;
  onSyncComplete?: (spot: SyncedSpot) => void;
}

export const GooglePlacesSearch: React.FC<GooglePlacesSearchProps> = ({
  spotId,
  onPlaceSelect,
  onSyncComplete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [radius, setRadius] = useState<number>();
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);

  const [searchGooglePlaces, { data, loading, error }] = useLazyQuery(SEARCH_GOOGLE_PLACES);
  const [syncSpot, { loading: syncLoading }] = useMutation(SYNC_SPOT_WITH_GOOGLE_PLACES);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    searchGooglePlaces({
      variables: {
        query: searchQuery,
        latitude,
        longitude,
        radius
      }
    });
  };

  const handlePlaceSelect = (place: GooglePlace) => {
    setSelectedPlace(place);
    onPlaceSelect?.(place);
  };

  const handleSync = async () => {
    if (!spotId || !selectedPlace) return;

    try {
      const result = await syncSpot({
        variables: {
          input: {
            spotId,
            googlePlaceId: selectedPlace.placeId
          }
        }
      });

      if (result.data?.syncSpotWithGooglePlaces?.success) {
        onSyncComplete?.(result.data.syncSpotWithGooglePlaces.spot);
        alert('スポット情報の同期が完了しました！');
      } else {
        const errors = result.data?.syncSpotWithGooglePlaces?.errors || ['同期に失敗しました'];
        alert(`同期エラー: ${errors.join(', ')}`);
      }
    } catch (err) {
      console.error('Sync error:', err);
      alert('同期中にエラーが発生しました');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
        }
      );
    }
  };

  return (
    <div className="google-places-search p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Google Places検索</h3>

      {/* 検索フォーム */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            検索キーワード
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="例: 福岡 カフェ"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              緯度
            </label>
            <input
              type="number"
              step="any"
              value={latitude || ''}
              onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="33.5904"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              経度
            </label>
            <input
              type="number"
              step="any"
              value={longitude || ''}
              onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="130.4017"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索半径（m）
            </label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '検索中...' : '検索'}
          </button>
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            現在地を取得
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          検索エラー: {error.message}
        </div>
      )}

      {/* 検索結果 */}
      {data?.searchGooglePlaces && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold">検索結果 ({data.searchGooglePlaces.length}件)</h4>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {data.searchGooglePlaces.map((place: GooglePlace) => (
              <div
                key={place.placeId}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPlace?.placeId === place.placeId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => handlePlaceSelect(place)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{place.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{place.formattedAddress}</p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {place.rating && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ {place.rating} ({place.userRatingCount || 0}件)
                        </span>
                      )}
                      {place.primaryTypeDisplayName && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {place.primaryTypeDisplayName}
                        </span>
                      )}
                      {place.businessStatus && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${place.businessStatus === 'OPERATIONAL'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {place.businessStatus === 'OPERATIONAL' ? '営業中' : '休業中'}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Place ID: {place.placeId}
                    </div>

                    {place.regularOpeningHours?.weekdayDescriptions && (
                      <div className="mt-2 text-xs text-gray-600">
                        <h6 className="font-semibold">営業時間:</h6>
                        <ul>
                          {place.regularOpeningHours.weekdayDescriptions.map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-3">
                      <h6 className="text-xs font-semibold text-gray-700 mb-1">サービス・設備</h6>
                      <div className="flex flex-wrap gap-1">
                        {place.takeout && <span className="chip">テイクアウト</span>}
                        {place.delivery && <span className="chip">デリバリー</span>}
                        {place.dineIn && <span className="chip">店内飲食</span>}
                        {place.curbsidePickup && <span className="chip">駐車場受取</span>}
                        {place.reservable && <span className="chip">予約可</span>}
                        {place.servesBreakfast && <span className="chip">朝食</span>}
                        {place.servesLunch && <span className="chip">ランチ</span>}
                        {place.servesDinner && <span className="chip">ディナー</span>}
                        {place.servesBrunch && <span className="chip">ブランチ</span>}
                        {place.servesBeer && <span className="chip">ビール</span>}
                        {place.servesWine && <span className="chip">ワイン</span>}
                        {place.servesCocktails && <span className="chip">カクテル</span>}
                        {place.servesDessert && <span className="chip">デザート</span>}
                        {place.servesCoffee && <span className="chip">コーヒー</span>}
                        {place.outdoorSeating && <span className="chip">屋外席</span>}
                        {place.liveMusic && <span className="chip">ライブ</span>}
                        {place.menuForChildren && <span className="chip">子供メニュー</span>}
                        {place.goodForChildren && <span className="chip">子供連れOK</span>}
                        {place.allowsDogs && <span className="chip">犬OK</span>}
                        {place.restroom && <span className="chip">トイレ</span>}
                        {place.goodForGroups && <span className="chip">グループ向き</span>}
                        {place.goodForWatchingSports && <span className="chip">スポーツ観戦</span>}
                        {place.paymentOptions?.acceptsCreditCards && <span className="chip">カード可</span>}
                        {place.paymentOptions?.acceptsDebitCards && <span className="chip">デビットカード可</span>}
                        {place.paymentOptions?.acceptsCashOnly && <span className="chip">現金のみ</span>}
                        {place.paymentOptions?.acceptsNfc && <span className="chip">NFC決済</span>}
                        {place.parkingOptions?.freeParkingLot && <span className="chip">無料駐車場</span>}
                        {place.parkingOptions?.paidParkingLot && <span className="chip">有料駐車場</span>}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-1">
                    {place.googleMapsUri && (
                      <a
                        href={place.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Google Maps
                      </a>
                    )}
                    {place.websiteUri && (
                      <a
                        href={place.websiteUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ウェブサイト
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 同期ボタン */}
      {selectedPlace && spotId && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-semibold mb-2">選択中のスポット</h5>
          <p className="text-sm text-gray-600 mb-3">{selectedPlace.name}</p>
          <button
            onClick={handleSync}
            disabled={syncLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncLoading ? '同期中...' : 'このスポットと同期'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
