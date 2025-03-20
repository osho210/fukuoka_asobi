'use client';

import { useParams } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';
import PlayPlanDetail from '@/components/PlayPlanDetail';
import '../../../../public/styles/common.css';
import '../../../../public/styles/PlayPlanDetail.css';

// GraphQLクエリの定義
const GET_PLAY_PLAN = gql`
  query GetPlayPlan($id: ID!) {
    playPlan(id: $id) {
      id
      planName
      description
      imageUrl
      location
      tripType
      totalBudget
      rating
      reviewCount
      favoriteCount
      status
      startDatetime
      endDatetime
      tags
      createdAt
      updatedAt
      recommendedFors {
        id
        name
      }
      plannerTitle
      plannerDescription
      user {
        id
        username
        profileImageUrl
        role
      }
      planDetails {
        id
        stepNumber
        stepName
        stepDescription
        comment
        startDatetime
        endDatetime
        budget
        notes
        plannerTitle
        plannerDescription
        spot {
          id
          spotName
          address
          phoneNumber
          website
          catchphrase
          reviewRating
          reviewCount
          instagramUrl
          budgetRange
          imageUrl
          theme
          isRainyOk
          district {
            id
            districtName
          }
          categories {
            id
            name
          }
          openingHours {
            id
            dayOfWeek
            openTime
            closeTime
          }
        }
      }
    }
  }
`;

export default function PlanDetailPage() {
  const params = useParams();
  const id = params.id as string;

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
