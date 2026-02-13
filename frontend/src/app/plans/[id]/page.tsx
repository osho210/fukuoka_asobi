import type { Metadata } from 'next';
import PlanDetailContainer from './plan-detail.container';

type PlanDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PlanDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fukuoka-asobi.com';
  const canonicalUrl = `${siteUrl}/plans/${id}`;

  return {
    title: 'プラン詳細 | 福岡遊び日記',
    description: '福岡市内を楽しむためのプランの詳細情報です。スポットやイベントを組み合わせた1日の楽しみ方を確認できます。',
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { id } = await params;

  return (
    <>
      <PlanDetailContainer planId={id} />
    </>
  );
}
