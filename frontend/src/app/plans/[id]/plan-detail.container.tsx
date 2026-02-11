'use client';

import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_PLAY_PLAN } from '@/graphql/playPlans';
import PlayPlanDetail from '@/components/PlayPlanDetail';
import RobotsMetaTag from '@/components/RobotsMetaTag';
import '@/styles/PlayPlanDetail.css';
import Link from 'next/link';

interface PlanDetailContainerProps {
  planId: string;
}

export default function PlanDetailContainer({ planId }: PlanDetailContainerProps) {
  const id = parseInt(planId, 10);
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_PLAY_PLAN, {
    variables: { id },
  });

  // ログインが必要な場合は動的にリダイレクト
  useEffect(() => {
    if (error?.message?.includes('ログインが必要です')) {
      const callbackUrl = `/plans/${planId}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [error?.message, planId, router]);

  // エラーメッセージに応じた表示内容を決定
  const getErrorContent = () => {
    if (!error) return null;

    const errorMessage = error.message;

    if (errorMessage.includes('ログインが必要です')) {
      // リダイレクト中のため、ここには到達しない（useEffect で処理）
      return null;
    } else if (errorMessage.includes('こちらのページは課金しないと見れません')) {
      return (
        <div className={'error-container'}>
          <h2>有償会員限定コンテンツ</h2>
          <p>このプランは有償会員または作成者本人のみが閲覧できます。</p>
          <p>有償会員になると、すべてのプランを閲覧できるようになります。</p>
          <div className={'action-buttons'}>
            <Link href="/mypage/subscription" className={'primary-button'}>有償会員になる</Link>
            <Link href="/plans" className={'secondary-button'}>他のプランを見る</Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className={'error-container'}>
          <h2>エラーが発生しました</h2>
          <p>{errorMessage}</p>
        </div>
      );
    }
  };

  if (loading) return (
    <>
      <div className="loading">読み込み中...</div>
    </>
  );

  if (error) return (
    <>
      {getErrorContent()}
    </>
  );

  if (!data || !data.playPlan) return (
    <>
      <div className="not-found">プランが見つかりませんでした</div>
    </>
  );

  return (
    <>
      <RobotsMetaTag isPublic={data.playPlan.isPublic ?? true} />
      <PlayPlanDetail plan={data.playPlan} />
    </>
  );
}
