import type { AppProps } from 'next/app';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import { FocusStyleManager } from '@blueprintjs/core';

import 'styles/globals.css';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          examples: relayStylePagination(),
        },
      },
    },
  }),
});

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  FocusStyleManager.onlyShowFocusOnTabs();
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
