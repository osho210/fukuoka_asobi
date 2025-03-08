'use client';

import StoreDetail from './store.container';
import { useParams } from 'next/navigation';

export default function StorePage() {
  const params = useParams();
  const storeId = params.id as string;

  return <StoreDetail storeId={storeId} />;
}
