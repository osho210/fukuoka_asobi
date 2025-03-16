'use client';

import SpotContainer from './spot.container';
import { useParams } from 'next/navigation';

export default function SpotPage() {
  const params = useParams();
  const spotId = params.id as string;

  return <SpotContainer spotId={spotId} />;
}
