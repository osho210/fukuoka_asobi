'use client';

import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
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
    }
  }
`;

interface GooglePlace {
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
}

interface GooglePlacesSearchProps {
  onPlaceSelect?: (place: GooglePlace) => void;
  className?: string;
}

export const GooglePlacesSearch: React.FC<GooglePlacesSearchProps> = ({
  onPlaceSelect,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [radius, setRadius] = useState<number>(5000);
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);

  const [searchGooglePlaces, { data, loading, error }] = useLazyQuery(SEARCH_GOOGLE_PLACES);

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          let errorMessage = '位置情報の取得に失敗しました。';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += ' ユーザーが位置情報の利用を許可しませんでした。';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += ' 位置情報が利用できません。';
              break;
            case error.TIMEOUT:
              errorMessage += ' 位置情報の取得がタイムアウトしました。';
              break;
            default:
              errorMessage += ' 不明なエラーが発生しました。';
          }
          setGeoError(errorMessage);
          console.error(errorMessage, error);
        }
      );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">スポット検索</h3>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索半径（m）
            </label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value) || 5000)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '検索中...' : '検索'}
          </button>
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
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
          <h4 className="text-md font-semibold text-gray-900">
            検索結果 ({data.searchGooglePlaces.length}件)
          </h4>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {data.searchGooglePlaces.map((place: GooglePlace) => (
              <div
                key={place.placeId}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPlace?.placeId === place.placeId
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handlePlaceSelect(place)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">{place.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{place.formattedAddress}</p>

                    <div className="flex flex-wrap gap-2 mb-2">
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
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          place.businessStatus === 'OPERATIONAL'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {place.businessStatus === 'OPERATIONAL' ? '営業中' : '休業中'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Place ID: {place.placeId}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-1">
                    {place.googleMapsUri && (
                      <a
                        href={place.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
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
                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
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

      {/* 選択されたスポット情報 */}
      {selectedPlace && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-semibold text-blue-900 mb-2">選択中のスポット</h5>
          <div className="text-sm text-blue-800">
            <p className="font-medium">{selectedPlace.name}</p>
            <p>{selectedPlace.formattedAddress}</p>
            {selectedPlace.rating && (
              <p>評価: ⭐ {selectedPlace.rating} ({selectedPlace.userRatingCount || 0}件)</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
