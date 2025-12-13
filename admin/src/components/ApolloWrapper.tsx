'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { ReactNode, useMemo } from 'react';

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
      credentials: 'include', // Cookie認証のために必須
    });

    return new ApolloClient({
      link: httpLink,
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
