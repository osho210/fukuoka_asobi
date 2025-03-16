import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { Spot } from '../types/spot';

// GraphQLクエリの定義
const GET_RECOMMENDED_SPOTS = gql`
  query GetRecommendedSpots {
    spots {
      id
      spotName
      spotType
      address
      reviewRating
      reviewCount
      imageUrl
      district {
        districtName
      }
      categories {
        name
      }
    }
  }
`;

interface RecommendedSpotsData {
  spots: Spot[];
}

const RecommendedSpot = () => {
  const { loading, error, data } = useQuery<RecommendedSpotsData>(GET_RECOMMENDED_SPOTS);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data || !data.spots || data.spots.length === 0) return <p>おすすめスポットが見つかりません</p>;

  return (
    <div className="recommended-spots">
      <h2 className="section-title">おすすめスポット</h2>
      <div className="spots-grid">
        {data.spots.slice(0, 5).map((spot) => (
          <Link href={`/spots/${spot.id}`} key={spot.id} className="spot-card">
            <div className="spot-image">
              {spot.imageUrl ? (
                <Image
                  src={spot.imageUrl.startsWith('http') ? spot.imageUrl : `/${spot.imageUrl}`}
                  alt={spot.spotName}
                  width={300}
                  height={200}
                  className="spot-thumbnail"
                />
              ) : (
                <div className="image-placeholder">
                  <span>No Image</span>
                </div>
              )}
              <div className="spot-type-badge">{spot.spotType}</div>
            </div>
            <div className="spot-content">
              <h3 className="spot-name">{spot.spotName}</h3>
              <div className="spot-meta">
                <span className="spot-location">{spot.district?.districtName}</span>
                {spot.categories && spot.categories.length > 0 && (
                  <span className="spot-category">{spot.categories[0].name}</span>
                )}
              </div>
              <div className="spot-rating">
                <span className="stars">★ {spot.reviewRating?.toFixed(1) || '0.0'}</span>
                <span className="review-count">({spot.reviewCount || 0})</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSpot;
