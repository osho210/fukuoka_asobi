import { Metadata } from 'next';
import SpotDetailContainer from './spot-detail.container';

type Props = {
  params: Promise<{ id: string }>;
};

// メタデータを生成する関数
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // GraphQL APIからスポット情報を取得
    const response = await fetch(
      process.env.NODE_ENV === 'production'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`
        : 'http://localhost:3000/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetSpot($id: ID!) {
              spot(id: $id) {
                id
                spotName
                isPublic
              }
            }
          `,
          variables: { id },
        }),
        next: { revalidate: 60 }, // ISR: 60秒後に stale-while-revalidate
      }
    );

    const { data } = await response.json();
    
    // is_publicがfalseの場合、noindexを設定
    if (data?.spot && !data.spot.isPublic) {
      return {
        title: data.spot.spotName,
        robots: {
          index: false,
          follow: false,
        },
      };
    }
    
    // 公開されている場合は通常のメタデータ
    return {
      title: data?.spot?.spotName || 'スポット詳細',
    };
  } catch (error) {
    console.error('Failed to fetch spot metadata:', error);
    // エラー時はデフォルトのメタデータを返す
    return {
      title: 'スポット詳細',
    };
  }
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
