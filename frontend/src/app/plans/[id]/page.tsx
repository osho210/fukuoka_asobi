'use client';

import { useParams } from 'next/navigation';
import PlanDetailContainer from './plan-detail.container';

export default function PlanDetailPage() {
  const params = useParams();
  const planId = params?.id as string;

  return (
    <>
      <PlanDetailContainer planId={planId} />
    </>
  );
}
