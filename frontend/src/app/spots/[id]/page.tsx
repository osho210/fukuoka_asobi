import { Metadata } from 'next';
import SpotDetailContainer from './spot-detail.container';
import { generateSpotMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ id: string }>;
};

async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return generateSpotMetadata(id);
}

async function SpotPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      {/* スポット詳細 */}
      <SpotDetailContainer spotId={id} />
    </>
  );
}

export { generateMetadata };
export default SpotPage;
