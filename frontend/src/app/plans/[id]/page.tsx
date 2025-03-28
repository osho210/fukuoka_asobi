'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';
import PlayPlanDetail from '@/components/PlayPlanDetail';
import '@styles/common.css';
import '@styles/PlayPlanDetail.css';
import { GET_PLAY_PLAN } from '@/graphql/playPlans';

// GraphQLクエリの定義
export default function PlanDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const { loading, error, data } = useQuery(GET_PLAY_PLAN, {
    variables: { id },
  });

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
      <div className="error">エラーが発生しました: {error.message}</div>
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
