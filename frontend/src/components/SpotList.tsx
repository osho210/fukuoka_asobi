import { useQuery } from '@apollo/client';
import { GET_SPOTS } from '../graphql/queries/getSpots';
import Link from 'next/link';
import { Spot, Category, Area, Hashtag } from '../types/spot';

interface SpotsData {
  spots: Spot[];
}

export default function SpotList() {
  const { loading, error, data } = useQuery<SpotsData>(GET_SPOTS);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data) return <p>データが見つかりません</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">店舗一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.spots.map((spot) => (
          <div key={spot.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{spot.spotName}</h2>
              <p className="text-gray-600 mb-4">{spot.catchphrase}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {spot.categories.map((category: Category) => (
                  <span key={category.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">エリア:</span> {spot.district.districtName} -
                  {spot.areas.map((area: Area) => area.areaName).join(', ')}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">予算:</span> {spot.budgetRange}
                </p>
                {spot.reviewRating && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">評価:</span> {spot.reviewRating} ({spot.reviewCount}件)
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {spot.hashtags.map((hashtag: Hashtag) => (
                  <span key={hashtag.id} className="text-xs text-gray-500">
                    {hashtag.hashtagName}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <Link href={`/spots/${spot.id}`} className="text-blue-600 hover:text-blue-800">
                  詳細を見る &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
