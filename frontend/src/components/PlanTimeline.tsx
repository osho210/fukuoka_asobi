'use client';

import React from 'react';
import { format } from 'date-fns';
import styles from '@/styles/PlanTimeline.module.css';

interface TravelDetail {
  sequenceNumber: number;
  travelMethod: string;
  travelTime: number;
}

interface Spot {
  id: string;
  spotName: string;
}

interface PlanDetail {
  id: string;
  stepNumber: number;
  stepName: string;
  startDatetime: string;
  endDatetime: string;
  spot: Spot;
  travelDetails: TravelDetail[];
}

interface PlanTimelineProps {
  planDetails: PlanDetail[];
}

const PlanTimeline: React.FC<PlanTimelineProps> = ({ planDetails }) => {
  // 時間フォーマット（HH:mm）
  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return format(date, 'HH:mm');
  };

  // 移動手段のアイコン
  const getTravelMethodIcon = (method: string) => {
    switch (method) {
      case 'walk':
        return '🚶';
      case 'car':
        return '🚗';
      case 'train':
        return '🚆';
      case 'bicycle':
        return '🚲';
      default:
        return '🔄';
    }
  };

  // 移動時間の表示（分→時間分）
  const formatTravelTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
  };

  return (
    <div className={styles.timelineContainer}>
      {planDetails.map((detail, index) => (
        <React.Fragment key={detail.id}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineTime}>
              {formatTime(detail.startDatetime)}
            </div>
            <div className={styles.timelinePoint}>
              <div className={styles.timelinePointDot}></div>
            </div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineSpot}>
                <span className={styles.timelineSpotNumber}>{detail.stepNumber}</span>
                <span className={styles.timelineSpotName}>{detail.stepName}</span>
              </div>
            </div>
          </div>

          {/* 滞在時間 */}
          <div className={styles.timelineStay}>
            <div className={styles.timelineStayLine}></div>
            <div className={styles.timelineStayDuration}>
              滞在: {Math.round((new Date(detail.endDatetime).getTime() - new Date(detail.startDatetime).getTime()) / 60000)}分
            </div>
          </div>

          {/* 移動情報（最後のスポット以外） */}
          {index < planDetails.length - 1 && detail.travelDetails.length > 0 && (
            <div className={styles.timelineTravel}>
              <div className={styles.timelineTime}>
                {formatTime(detail.endDatetime)}
              </div>
              <div className={styles.timelineTravelLine}>
                <div className={styles.timelineTravelIcon}>
                  {getTravelMethodIcon(detail.travelDetails[0].travelMethod)}
                </div>
              </div>
              <div className={styles.timelineTravelInfo}>
                <div className={styles.timelineTravelMethod}>
                  {detail.travelDetails[0].travelMethod === 'walk' ? '徒歩' :
                   detail.travelDetails[0].travelMethod === 'car' ? '車' :
                   detail.travelDetails[0].travelMethod === 'train' ? '電車' :
                   detail.travelDetails[0].travelMethod === 'bicycle' ? '自転車' : 'その他'}
                </div>
                <div className={styles.timelineTravelTime}>
                  {formatTravelTime(detail.travelDetails[0].travelTime)}
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}

      {/* 最終時間 */}
      {planDetails.length > 0 && (
        <div className={styles.timelineItem}>
          <div className={styles.timelineTime}>
            {formatTime(planDetails[planDetails.length - 1].endDatetime)}
          </div>
          <div className={styles.timelinePoint}>
            <div className={styles.timelinePointDot}></div>
          </div>
          <div className={styles.timelineContent}>
            <div className={styles.timelineEnd}>プラン終了</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTimeline;
