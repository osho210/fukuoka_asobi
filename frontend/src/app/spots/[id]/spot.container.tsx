import { useQuery } from '@apollo/client';
import { GET_SPOT } from '@graphql/queries/getSpot';
import { GetSpotQuery } from '@/__generated__/types';
import SpotPresenter from './presenter'

interface SpotContainerProps {
  spotId: string;
}

export default function SpotContainer({ spotId }: SpotContainerProps) {
  const { loading, error, data } = useQuery<GetSpotQuery>(GET_SPOT, {
    variables: { id: spotId },
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data || !data.spot) return <p>スポットが見つかりません</p>;

  const { spot } = data;

  return <SpotPresenter spot={spot} />
}
