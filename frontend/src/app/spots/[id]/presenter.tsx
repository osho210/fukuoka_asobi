import { GetSpotQuery } from '@/__generated__/types';
import Image from 'next/image';
import Link from 'next/link';
import BusinessHours from '@/components/BusinessHours';
import '@/styles/RecommendedSpot.css'

type SpotFromQuery = NonNullable<GetSpotQuery['spot']>;

interface SpotPresenterProps {
  spot: SpotFromQuery;
}

export default function SpotPresenter({ spot }: SpotPresenterProps) {
  return (
    <>
      <div className="mb-4">
        <Link href="/spots" className="section-link">
          ← スポット一覧に戻る
        </Link>
      </div>
      <div className="spot-detail">
        <div className="spot-header">
          <h1 className="spot-name">{spot.spotName}</h1>
          <div className="spot-type-badge">{spot.spotType}</div>
          {spot.isClosed && <div className="closed-badge">閉店</div>}
        </div>

        <div className="spot-info">
          <div className="spot-image">
            {/* 画像があれば表示、なければプレースホルダー */}
            {spot.imageUrl ? (
              <Image
                src={spot.imageUrl.url}
                alt={spot.spotName}
                className="spot-detail-image"
              />
            ) : (
              <div className="event-detail-no-image">
                <span className="image-placeholder">No Image</span>
              </div>
            )}
          </div>

          <div className="spot-details">
            <div className="spot-meta">
              <div className="rating">
                <span className="stars">★ {spot.reviewRating?.toFixed(1) || '0.0'}</span>
                <span className="review-count">({spot.reviewCount || 0}件のレビュー)</span>
              </div>

              <div className="spot-location">
                <h3>場所</h3>
                <p>{spot.district.districtName} / {spot.areas.map(area => area.areaName).join(', ')}</p>
                <p>{spot.address}</p>
                {spot.nearestStation && <p>最寄駅: {spot.nearestStation}</p>}
              </div>

              <div className="spot-contact">
                <h3>連絡先</h3>
                {spot.phoneNumber && <p>電話: {spot.phoneNumber}</p>}
                {spot.website && (
                  <p>
                    <a href={spot.website} target="_blank" rel="noopener noreferrer">
                      ウェブサイト
                    </a>
                  </p>
                )}
                {spot.instagramUrl && (
                  <p>
                    <a href={spot.instagramUrl} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  </p>
                )}
              </div>

              <div className="spot-features">
                <h3>特徴</h3>
                <ul>
                  {spot.categories.map(category => (
                    <li key={category.id}>{category.name}</li>
                  ))}
                  {spot.parkingAvailable && <li>駐車場あり</li>}
                  {spot.isRainyOk && <li>雨天OK</li>}
                  {spot.budgetRange && <li>予算: {spot.budgetRange}</li>}
                  {spot.theme && <li>テーマ: {spot.theme}</li>}
                </ul>
              </div>

              <BusinessHours spot={spot} />

              {spot.menus.length > 0 && (
                <div className="menus">
                  <h3>メニュー</h3>
                  <ul>
                    {spot.menus.map(menu => (
                      <li key={menu.id}>
                        <strong>{menu.menuName}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {spot.hashtags.length > 0 && (
                <div className="hashtags">
                  <h3>ハッシュタグ</h3>
                  <div className="tag-list">
                    {spot.hashtags.map(tag => (
                      <span key={tag.id} className="tag">
                        {tag.hashtagName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
