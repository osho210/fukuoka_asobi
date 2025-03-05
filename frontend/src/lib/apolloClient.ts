import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        // Railsのエンドポイントを設定
        uri: 'http://localhost:3000/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});

export default client;
