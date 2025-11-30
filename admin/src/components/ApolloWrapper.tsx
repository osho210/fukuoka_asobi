'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ReactNode, useMemo } from 'react';

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
    });

    const authLink = setContext((_, { headers }) => {
      // ブラウザ環境でのみ localStorage にアクセス
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
