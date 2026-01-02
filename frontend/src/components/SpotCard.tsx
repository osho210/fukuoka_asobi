import Link from 'next/link';
import Image from 'next/image';

type SpotCardProps = {
  id: string;
  spotName: string;
  address?: string | null;
  catchphrase?: string | null;
  imageUrl?: { id: string, url: string } | null;
  reviewRating?: number | null;
  reviewCount?: number | null;
  budgetRange?: string | null;
  categoryNames?: string[] | null;
};

export default function SpotCard({
  id,
  spotName,
  address,
  catchphrase,
  imageUrl,
  reviewRating,
  reviewCount,
  budgetRange,
}: SpotCardProps) {
  // キャッチフレーズの短縮表示（100文字まで）
  const shortCatchphrase = catchphrase && catchphrase.length > 100
    ? `${catchphrase.substring(0, 100)}...`
    : catchphrase;

  return (
    <Link href={`/spots/${id}`} className="spot-card-link">
      <div className="spot-card">
        <div className="spot-card-image-container">
          {imageUrl ? (
            <Image
              src={imageUrl ? imageUrl.url : '/no-image.png'}
              alt={spotName}
              fill
              className="spot-card-image"
            />
          ) : (
            <div className="spot-card-no-image">
              <span className="spot-card-no-image-text">No Image</span>
            </div>
          )}
        </div>
        <div className="spot-card-content">
          <h3 className="spot-card-title">{spotName}</h3>
          {shortCatchphrase && <p className="spot-card-catchphrase">{shortCatchphrase}</p>}
          <div className="spot-card-footer">
            {address && <span className="spot-card-address">{address}</span>}
            {reviewRating && (
              <div className="spot-card-rating">
                <span className="spot-card-rating-stars">{'★'.repeat(Math.floor(reviewRating))}</span>
                <span className="spot-card-rating-value">{reviewRating.toFixed(1)}</span>
                {reviewCount && <span className="spot-card-review-count">({reviewCount})</span>}
              </div>
            )}
            {budgetRange && <span className="spot-card-budget">{budgetRange}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
