import { Metadata } from 'next';
import PlanDetailContainer from './plan-detail.container';
import { fetchPlayPlanForMetadata } from '@/lib/metadata';

type PlanPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PlanPageProps): Promise<Metadata> {
  const { id } = await params;
  const planId = parseInt(id, 10);
  const plan = await fetchPlayPlanForMetadata(planId);

  // データが取得できない場合やis_indexableがfalseの場合は noindex を設定
  if (!plan || !plan.isIndexable) {
    return {
      title: plan?.planName ? `${plan.planName} | 福岡遊び日記` : 'プラン詳細 | 福岡遊び日記',
      description: plan?.catchCopy || plan?.description || '福岡のおすすめプラン情報',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${plan.planName} | 福岡遊び日記`,
    description: plan.catchCopy || plan.description || `${plan.planName}の詳細情報`,
    openGraph: {
      title: plan.planName,
      description: plan.catchCopy || plan.description || '',
      images: plan.imageUrl ? [{ url: plan.imageUrl }] : [],
    },
  };
}

export default async function PlanDetailPage({ params }: PlanPageProps) {
  const { id } = await params;

  return (
    <>
      <PlanDetailContainer planId={id} />
    </>
  );
}

