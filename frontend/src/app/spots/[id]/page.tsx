import { Metadata } from 'next';
import SpotDetailContainer from './spot-detail.container';
import { generateSpotMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return generateSpotMetadata(id);
}

export default async function SpotPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      {/* スポット詳細 */}
      <SpotDetailContainer spotId={id} />
    </>
  );
}
