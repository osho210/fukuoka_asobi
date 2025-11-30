'use client';

import React from 'react';
import { PlanDetail } from '@/__generated__/graphql';
import { formatTime } from '@/utils/dateUtils';
import '@/styles/PlanTimeline.css';

interface PlanTimelineProps {
  planDetails: PlanDetail[];
}

const PlanTimeline: React.FC<PlanTimelineProps> = ({ planDetails }) => {
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
  const formatLocalTravelTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
  };

  // 安全に日付を計算する関数
  const calculateDuration = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return 0;
    return Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000);
  };

  return (
    <div className="timelineContainer">
      {planDetails.map((detail, index) => (
        <React.Fragment key={detail.id}>
          <div className="timelineItem">
            <div className="timelineTime">
              {detail.startTime && formatTime(detail.startTime)}
            </div>
            <div className="timelinePoint">
              <div className="timelinePointDot"></div>
            </div>
            <div className="timelineContent">
              <div className="timelineSpot">
                <span className="timelineSpotNumber">{detail.stepNumber}</span>
                <span className="timelineSpotName">{detail.stepName}</span>
              </div>
            </div>
          </div>

          {/* 滞在時間 */}
          {detail.startTime && detail.endTime && (
            <div className="timelineStay">
              <div className="timelineStayLine"></div>
              <div className="timelineStayDuration">
                滞在: {calculateDuration(detail.startTime, detail.endTime)}分
              </div>
            </div>
          )}

          {/* 移動情報（最後のスポット以外） */}
          {index < planDetails.length - 1 && detail.travelDetails && detail.travelDetails.length > 0 && (
            <div className="timelineTravel">
              <div className="timelineTime">
                {detail.endTime && formatTime(detail.endTime)}
              </div>
              <div className="timelineTravelLine">
                <div className="timelineTravelIcon">
                  {getTravelMethodIcon(detail.travelDetails[0].travelMethod)}
                </div>
              </div>
              <div className="timelineTravelInfo">
                <div className="timelineTravelMethod">
                  {detail.travelDetails[0].travelMethod === 'walk' ? '徒歩' :
                    detail.travelDetails[0].travelMethod === 'car' ? '車' :
                      detail.travelDetails[0].travelMethod === 'train' ? '電車' :
                        detail.travelDetails[0].travelMethod === 'bicycle' ? '自転車' : 'その他'}
                </div>
                <div className="timelineTravelTime">
                  {formatLocalTravelTime(detail.travelDetails[0].travelTime)}
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}

      {/* 最終時間 */}
      {planDetails.length > 0 && planDetails[planDetails.length - 1].endTime && (
        <div className="timelineItem">
          <div className="timelineTime">
            {formatTime(planDetails[planDetails.length - 1].endTime)}
          </div>
          <div className="timelinePoint">
            <div className="timelinePointDot"></div>
          </div>
          <div className="timelineContent">
            <div className="timelineEnd">プラン終了</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTimeline;
