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
    <div className="spot-list-container">
      <h1 className="spot-list-heading">店舗一覧</h1>
      <div className="spot-list-grid">
        {data.spots.map((spot) => (
          <div key={spot.id} className="spot-card">
            <div className="spot-card-content">
              <h2 className="spot-card-title">{spot.spotName}</h2>
              <p className="spot-card-catchphrase">{spot.catchphrase}</p>
              <div className="spot-card-categories">
                {spot.categories.map((category: Category) => (
                  <span key={category.id} className="spot-category-tag">
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="spot-card-details">
                <p className="spot-card-area">
                  <span className="spot-card-label">エリア:</span> {spot.district.districtName} -
                  {spot.areas.map((area: Area) => area.areaName).join(', ')}
                </p>
                <p className="spot-card-budget">
                  <span className="spot-card-label">予算:</span> {spot.budgetRange}
                </p>
                {spot.reviewRating && (
                  <p className="spot-card-rating">
                    <span className="spot-card-label">評価:</span> {spot.reviewRating} ({spot.reviewCount}件)
                  </p>
                )}
              </div>
              <div className="spot-card-hashtags">
                {spot.hashtags.map((hashtag: Hashtag) => (
                  <span key={hashtag.id} className="spot-hashtag">
                    {hashtag.hashtagName}
                  </span>
                ))}
              </div>
              <div className="spot-card-link">
                <Link href={`/spots/${spot.id}`} className="spot-detail-link">
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
