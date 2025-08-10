import { gql } from '@apollo/client';

export const UPDATE_PLAY_PLAN = gql`
  mutation UpdatePlayPlan($input: UpdatePlayPlanInput!) {
    updatePlayPlan(input: $input) {
      playPlan {
        id
        planName
        description
        status
        tripType
        totalBudget
        location
        startDatetime
        endDatetime
        imageUrl
        imageUrls {
          id
          url
        }
        tags
        favoriteCount
        publishedAt
        plannerDescription
        rating
        reviewCount
        recommendedFors {
          id
          name
        }
      }
      planDetails {
        id
        planId
        stepNumber
        stepName
        stepDescription
        startDatetime
        endDatetime
        budget
        comment
        notes
        spot {
          id
        }
      }
      errors
    }
  }
`;

/**
 * プラン詳細データの型定義
 */
export interface PlanDetailWithSpot {
  id: string;
  stepNumber?: number;
  stepName?: string;
  stepDescription?: string;
  startDatetime?: string;
  endDatetime?: string;
  budget?: number;
  comment?: string;
  notes?: string;
  spot?: {
    id: string;
    spotName?: string;
    address?: string;
    phoneNumber?: string;
    budgetRange?: string;
    isRainyOk?: boolean;
    imageUrl?: string;
    catchphrase?: string;
    __typename?: string;
  };
  __typename?: string;
  planId?: string | number;
  spotId?: number;
}

/**
 * 処理後のプラン詳細データの型定義
 */
export interface ProcessedPlanDetail {
  id: string;
  stepNumber?: number;
  stepName?: string;
  stepDescription?: string;
  startDatetime?: string;
  endDatetime?: string;
  budget?: number;
  comment?: string;
  notes?: string;
  spotId?: number;
  planId?: string | number;
}

/**
 * プラン詳細データを処理して、spotオブジェクトからspotIdを抽出する関数
 * @param planDetails プラン詳細データの配列
 * @returns spotIdのみを含むプラン詳細データの配列
 */
export const processPlanDetailsForInput = (planDetails: PlanDetailWithSpot[]) => {
  if (!planDetails || !Array.isArray(planDetails)) {
    return [];
  }

  return planDetails.map(detail => {
    if (!detail) return detail;

    // 新しいオブジェクトを作成して元のプロパティをコピー
    const processedDetail = { ...detail };

    // spotオブジェクトがある場合、spotIdを抽出
    if (detail.spot && detail.spot.id) {
      processedDetail.spotId = parseInt(detail.spot.id, 10);
    }

    // spotオブジェクトを常に削除（nullの場合も含む）
    delete processedDetail.spot;

    // __typenameを削除
    if ('__typename' in processedDetail) {
      delete processedDetail.__typename;
    }

    return processedDetail;
  });
};
