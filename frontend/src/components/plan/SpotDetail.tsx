'use client';

import Image from 'next/image';
import { Spot } from '@/types/plan';
import BusinessHours from '../BusinessHours';

interface SpotDetailProps {
  spot: Spot;
}

const SpotDetail: React.FC<SpotDetailProps> = ({ spot }) => {
  if (!spot) return null;

  return (
    <div className="plan-step-spot">
      <div className="plan-step-spot-header">
        <span className="plan-step-spot-name">{spot.spotName}</span>
      </div>

      <div className="plan-step-spot-details">
        {spot.address && (
          <div className="plan-step-spot-detail">
            <span>📍</span>
            <span>{spot.address}</span>
          </div>
        )}
        {spot.phoneNumber && (
          <div className="plan-step-spot-detail">
            <span>📞</span>
            <span>{spot.phoneNumber}</span>
          </div>
        )}
        {spot.budgetRange && (
          <div className="plan-step-spot-detail">
            <span>💰</span>
            <span>{spot.budgetRange}</span>
          </div>
        )}
        {spot.district && (
          <div className="plan-step-spot-detail">
            <span>🏙️</span>
            <span>{spot.district.districtName}</span>
          </div>
        )}
        {spot.isRainyOk !== undefined && (
          <div className="plan-step-spot-detail">
            <span>{spot.isRainyOk ? '☂️ 雨OK' : '☔ 雨NG'}</span>
          </div>
        )}
      </div>

      {spot.imageUrl && (
        <div className="plan-step-spot-image">
          <Image
            src={spot.imageUrl.startsWith('/') ? spot.imageUrl : `/${spot.imageUrl}`}
            alt={spot.spotName}
            fill
            className="spot-image"
          />
        </div>
      )}

      {spot.categories && spot.categories.length > 0 && (
        <div className="plan-step-spot-categories">
          {spot.categories.map(category => (
            <span key={category.id} className="plan-step-spot-category">
              {category.name}
            </span>
          ))}
        </div>
      )}

      {spot.openingHourList && spot.openingHourList.length > 0 && (
        <div className="plan-step-spot-business-hours">
          <BusinessHours spot={spot} />
        </div>
      )}
    </div>
  );
};

export default SpotDetail;
