import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
// import { relayStylePagination } from '@apollo/client/utilities';
import { FocusStyleManager } from '@blueprintjs/core';

import 'styles/globals.css';

const apolloClient = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    /*
    typePolicies: {
      Query: {
        fields: {
          examples: relayStylePagination(),
        },
      },
    },
    */
  }),
});

const App: React.FC<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  FocusStyleManager.onlyShowFocusOnTabs();
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  );
};

export default App;
