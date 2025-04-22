'use client';

import { useQuery } from '@apollo/client';
import { GET_SPOT } from '../../../graphql/queries/getSpot';
import { Spot } from '../../../types/spot';
import SpotDetailAdapter from '@/components/adapters/SpotDetailAdapter';

interface SpotDetailContainerProps {
  spotId: string;
}

interface SpotData {
  spot: Spot;
}

export default function SpotDetailContainer({ spotId }: SpotDetailContainerProps) {
  const { loading, error, data } = useQuery<SpotData>(GET_SPOT, {
    variables: { id: spotId },
  });

  if (loading) return <div className="content-detail-loading">読み込み中...</div>;
  if (error) return <div className="content-detail-error">エラーが発生しました: {error.message}</div>;
  if (!data || !data.spot) return <div className="content-detail-not-found">スポットが見つかりません</div>;

  return <SpotDetailAdapter spot={data.spot} />;
}
