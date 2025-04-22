'use client';

import { useParams } from 'next/navigation';
import SpotDetailContainer from './spot-detail.container';

export default function SpotPage() {
  const params = useParams();
  const spotId = params.id as string;

  return (
    <>
      {/* スポット詳細 */}
      <SpotDetailContainer spotId={spotId} />
    </>
  );
}
