import { Metadata } from 'next';
import PlanDetailContainer from './plan-detail.container';

type Props = {
  params: Promise<{ id: string }>;
};

// メタデータを生成する関数
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // GraphQL APIからプラン情報を取得
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
            query GetPlayPlan($id: Int!) {
              playPlan(id: $id) {
                id
                planName
                isPublic
              }
            }
          `,
          variables: { id: parseInt(id, 10) },
        }),
        next: { revalidate: 60 }, // ISR: 60秒後に stale-while-revalidate
      }
    );

    const { data } = await response.json();
    
    // is_publicがfalseの場合、noindexを設定
    if (data?.playPlan && !data.playPlan.isPublic) {
      return {
        title: data.playPlan.planName,
        robots: {
          index: false,
          follow: false,
        },
      };
    }
    
    // 公開されている場合は通常のメタデータ
    return {
      title: data?.playPlan?.planName || 'プラン詳細',
    };
  } catch (error) {
    console.error('Failed to fetch plan metadata:', error);
    // エラー時はデフォルトのメタデータを返す
    return {
      title: 'プラン詳細',
    };
  }
}

export default async function PlanDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <PlanDetailContainer planId={id} />
    </>
  );
}
