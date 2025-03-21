import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        // Next.jsのリライト機能を使用するため相対パスを設定
        uri: '/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});

export default client;
