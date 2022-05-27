import NextApp from 'next/app';
import { SessionProvider } from 'next-auth/react';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
} from '@apollo/client';
import { FocusStyleManager } from '@blueprintjs/core';

import { withApollo } from 'libs/withApollo';
import { UserContextProvider } from 'hooks/useCurrentUser';

import 'styles/globals.css';

class App extends NextApp<{ apollo: ApolloClient<NormalizedCacheObject> }> {
  static async getInitialProps({ Component, ctx }: any) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  componentDidMount() {
    FocusStyleManager.onlyShowFocusOnTabs();
  }

  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={apollo}>
          <UserContextProvider>
            <Component {...pageProps} />
          </UserContextProvider>
        </ApolloProvider>
      </SessionProvider>
    );
  }
}

export default withApollo(App);
