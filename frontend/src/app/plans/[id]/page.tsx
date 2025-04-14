'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';
import PlayPlanDetail from '@/components/PlayPlanDetail';
import '@styles/common.css';
import styles from '@/styles/PlayPlanDetail.module.css';
import { GET_PLAY_PLAN } from '@/graphql/playPlans';
import Link from 'next/link';

// GraphQLクエリの定義
export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const { loading, error, data } = useQuery(GET_PLAY_PLAN, {
    variables: { id },
  });

  // エラーメッセージに応じた表示内容を決定
  const getErrorContent = () => {
    if (!error) return null;

    const errorMessage = error.message;

    if (errorMessage.includes('ログインが必要です')) {
      return (
        <div className={styles['error-container']}>
          <h2>ログインが必要です</h2>
          <p>このプランを閲覧するにはログインが必要です。</p>
          <div className={styles['action-buttons']}>
            <Link href="/login" className={styles['primary-button']}>ログインする</Link>
            <Link href="/register" className={styles['secondary-button']}>新規登録する</Link>
          </div>
        </div>
      );
    } else if (errorMessage.includes('こちらのページは課金しないと見れません')) {
      return (
        <div className={styles['error-container']}>
          <h2>有償会員限定コンテンツ</h2>
          <p>このプランは有償会員または作成者本人のみが閲覧できます。</p>
          <p>有償会員になると、すべてのプランを閲覧できるようになります。</p>
          <div className={styles['action-buttons']}>
            <Link href="/mypage/subscription" className={styles['primary-button']}>有償会員になる</Link>
            <Link href="/plans" className={styles['secondary-button']}>他のプランを見る</Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles['error-container']}>
          <h2> エラーが発生しました</h2>
          <p>{errorMessage}</p>
          <div className={styles['action-buttons']}>
            <button onClick={() => router.back()} className={styles['secondary-button']}>戻る</button>
          </div >
        </div >
      );
    }
  };

  if (loading) return (
    <div className="container">
      <header className="header">
        <h1>
          <Image className="logo" src={'/logo.png'} width={190} height={45} alt="logo" />
        </h1>
        <HamburgerMenu />
      </header>
      <div className="loading">読み込み中...</div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="container">
      <header className="header">
        <h1>
          <Image className="logo" src={'/logo.png'} width={190} height={45} alt="logo" />
        </h1>
        <HamburgerMenu />
      </header>
      {getErrorContent()}
      <Footer />
    </div>
  );

  if (!data || !data.playPlan) return (
    <div className="container">
      <header className="header">
        <h1>
          <Image className="logo" src={'/logo.png'} width={190} height={45} alt="logo" />
        </h1>
        <HamburgerMenu />
      </header>
      <div className="not-found">プランが見つかりませんでした</div>
      <Footer />
    </div>
  );

  return (
    <div className="container">
      <header className="header">
        <h1>
          <Image className="logo" src={'/logo.png'} width={190} height={45} alt="logo" />
        </h1>
        <HamburgerMenu />
      </header>
      <PlayPlanDetail plan={data.playPlan} />
      <Footer />
    </div>
  );
}