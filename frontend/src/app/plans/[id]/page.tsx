import { Metadata } from 'next';
import PlanDetailContainer from './plan-detail.container';
import { generatePlayPlanMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ id: string }>;
};

async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return generatePlayPlanMetadata(id);
}

async function PlanDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <PlanDetailContainer planId={id} />
    </>
  );
}

export { generateMetadata };
export default PlanDetailPage;
