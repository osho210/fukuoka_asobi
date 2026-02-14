import { Metadata } from 'next';
import PlanDetailContainer from './plan-detail.container';
import { generatePlayPlanMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return generatePlayPlanMetadata(id);
}

export default async function PlanDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <PlanDetailContainer planId={id} />
    </>
  );
}
