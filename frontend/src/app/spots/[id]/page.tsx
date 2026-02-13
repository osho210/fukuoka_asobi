import type { Metadata } from 'next';
import SpotDetailContainer from './spot-detail.container';

type SpotPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: SpotPageProps): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fukuoka-asobi.com';
  const canonicalUrl = `${siteUrl}/spots/${id}`;

  return {
    title: 'スポット詳細 | 福岡遊び日記',
    description: '福岡市内のおすすめスポットの詳細情報です。住所、営業時間、アクセス方法などを確認できます。',
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function SpotPage({ params }: SpotPageProps) {
  const { id } = await params;

  return (
    <>
      {/* スポット詳細 */}
      <SpotDetailContainer spotId={id} />
    </>
  );
}
