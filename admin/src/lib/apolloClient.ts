import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

/**
 * Apollo Client の設定
 * Cookie ベースの認証を使用してリクエストを送信
 * credentials: 'include' により、すべてのリクエストで自動的に Cookie が含まれる
 */
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
  credentials: 'include',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
