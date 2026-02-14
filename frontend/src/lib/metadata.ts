import { Metadata } from 'next';
import { gql } from '@apollo/client';

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/graphql`;

// メタデータ取得用のGraphQLクエリ
const GET_PLAY_PLAN_METADATA = gql`
  query GetPlayPlanMetadata($id: Int!) {
    playPlan(id: $id) {
      id
      planName
      isPublic
    }
  }
`;

const GET_SPOT_METADATA = gql`
  query GetSpotMetadata($id: ID!) {
    spot(id: $id) {
      id
      spotName
      isPublic
    }
  }
`;

/**
 * プラン詳細ページのメタデータを生成
 */
async function generatePlayPlanMetadata(id: string): Promise<Metadata> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PLAY_PLAN_METADATA.loc?.source.body,
        variables: { id: parseInt(id, 10) },
      }),
      next: { revalidate: 60 }, // ISR: 60秒後に stale-while-revalidate
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    const playPlan = result.data?.playPlan;

    // is_publicがfalseの場合、noindexを設定
    if (playPlan && !playPlan.isPublic) {
      return {
        title: playPlan.planName,
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // 公開されている場合は通常のメタデータ
    return {
      title: playPlan?.planName || 'プラン詳細',
    };
  } catch (error) {
    // サーバー側でエラーをログ出力
    if (typeof window === 'undefined') {
      console.error('Failed to fetch plan metadata:', error);
    }
    // エラー時はデフォルトのメタデータを返す
    return {
      title: 'プラン詳細',
    };
  }
}

/**
 * スポット詳細ページのメタデータを生成
 */
async function generateSpotMetadata(id: string): Promise<Metadata> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_SPOT_METADATA.loc?.source.body,
        variables: { id },
      }),
      next: { revalidate: 60 }, // ISR: 60秒後に stale-while-revalidate
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    const spot = result.data?.spot;

    // is_publicがfalseの場合、noindexを設定
    if (spot && !spot.isPublic) {
      return {
        title: spot.spotName,
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // 公開されている場合は通常のメタデータ
    return {
      title: spot?.spotName || 'スポット詳細',
    };
  } catch (error) {
    // サーバー側でエラーをログ出力
    if (typeof window === 'undefined') {
      console.error('Failed to fetch spot metadata:', error);
    }
    // エラー時はデフォルトのメタデータを返す
    return {
      title: 'スポット詳細',
    };
  }
}

export { generatePlayPlanMetadata, generateSpotMetadata };
