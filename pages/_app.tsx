import { useEffect } from 'react';
import NextApp from 'next/app';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
} from '@apollo/client';
import { FocusStyleManager } from '@blueprintjs/core';

import { withApollo } from 'libs/withApollo';

import 'styles/globals.css';

interface Props extends AppProps {
  apollo: ApolloClient<NormalizedCacheObject>;
}

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
          <Component {...pageProps} />
        </ApolloProvider>
      </SessionProvider>
    );
  }
}

export default withApollo(App);
