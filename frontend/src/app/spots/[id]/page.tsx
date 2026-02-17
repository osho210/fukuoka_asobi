import { Metadata } from 'next';
import SpotDetailContainer from './spot-detail.container';
import { fetchSpotForMetadata } from '@/lib/metadata';

type SpotPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: SpotPageProps): Promise<Metadata> {
  const { id } = await params;
  const spot = await fetchSpotForMetadata(id);

  // データが取得できない場合やis_indexableがfalseの場合は noindex を設定
  if (!spot || !spot.isIndexable) {
    return {
      title: spot?.spotName ? `${spot.spotName} | 福岡遊び日記` : 'スポット詳細 | 福岡遊び日記',
      description: spot?.catchphrase || spot?.description || '福岡のおすすめスポット情報',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${spot.spotName} | 福岡遊び日記`,
    description: spot.catchphrase || spot.description || `${spot.spotName}の詳細情報`,
    openGraph: {
      title: spot.spotName,
      description: spot.catchphrase || spot.description || '',
      images: spot.imageUrl?.url ? [{ url: spot.imageUrl.url }] : [],
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

