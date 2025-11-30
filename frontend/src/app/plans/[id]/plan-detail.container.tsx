'use client';

import { useQuery } from '@apollo/client';
import { GET_PLAY_PLAN } from '@/graphql/playPlans';
import PlayPlanDetail from '@/components/PlayPlanDetail';
import '@/styles/PlayPlanDetail.css';
import Link from 'next/link';

interface PlanDetailContainerProps {
  planId: string;
}

export default function PlanDetailContainer({ planId }: PlanDetailContainerProps) {
  const id = parseInt(planId, 10);

  const { loading, error, data } = useQuery(GET_PLAY_PLAN, {
    variables: { id },
  });

  // エラーメッセージに応じた表示内容を決定
  const getErrorContent = () => {
    if (!error) return null;

    const errorMessage = error.message;

    if (errorMessage.includes('ログインが必要です')) {
      return (
        <div className={'error-container'}>
          <h2>ログインが必要です</h2>
          <p>このプランを閲覧するにはログインが必要です。</p>
          <div className={'action-buttons'}>
            <Link href="/login" className={'primary-button'}>ログインする</Link>
            <Link href="/register" className={'secondary-button'}>新規登録する</Link>
          </div>
        </div>
      );
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
      <PlayPlanDetail plan={data.playPlan} />
    </>
  );
}
