import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GET_SPOT } from '@/graphql/queries/getSpot';
import { GET_PLAY_PLAN } from '@/graphql/playPlans';

// サーバーサイド専用のApolloクライアント
function getServerApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NODE_ENV === 'production'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`
        : 'http://localhost:3000/graphql',
      credentials: 'include',
      // サーバーサイドではSSR用のヘッダーを設定
      fetchOptions: {
        cache: 'no-store',
      },
    }),
    cache: new InMemoryCache(),
  });
}

/**
 * Spot のメタデータ取得用データをフェッチ
 */
export async function fetchSpotForMetadata(id: string) {
  const client = getServerApolloClient();
  
  try {
    const { data } = await client.query({
      query: GET_SPOT,
      variables: { id },
      fetchPolicy: 'no-cache',
    });
    
    return data?.spot;
  } catch (error) {
    console.error('Failed to fetch spot for metadata:', error);
    return null;
  }
}

/**
 * PlayPlan のメタデータ取得用データをフェッチ
 */
export async function fetchPlayPlanForMetadata(id: number) {
  const client = getServerApolloClient();
  
  try {
    const { data } = await client.query({
      query: GET_PLAY_PLAN,
      variables: { id },
      fetchPolicy: 'no-cache',
    });
    
    return data?.playPlan;
  } catch (error) {
    console.error('Failed to fetch play plan for metadata:', error);
    return null;
  }
}
