import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  HttpLink,
  InMemoryCache,
  Observable,
  Operation,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { relayStylePagination } from '@apollo/client/utilities';
import { getOperationAST, GraphQLError, print } from 'graphql';
import { Client, createClient } from 'graphql-ws';
import withApolloBase from 'next-with-apollo';

import { GraphileApolloLink } from './GraphileApolloLink';

let wsClient: Client | null = null;

class WebSocketLink extends ApolloLink {
  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      if (!wsClient) {
        sink.error(new Error('No websocket connection'));
        return;
      }
      return wsClient.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: (err) => {
            if (err instanceof Error) {
              sink.error(err);
            } else if (err instanceof CloseEvent) {
              sink.error(
                new Error(
                  `Socket closed with event ${err.code}` + err.reason
                    ? `: ${err.reason}` // reason will be available on clean closes
                    : '',
                ),
              );
            } else {
              sink.error(
                new Error(
                  (err as GraphQLError[])
                    .map(({ message }) => message)
                    .join(', '),
                ),
              );
            }
          },
        },
      );
    });
  }
}

function createWsClient() {
  return createClient({
    url: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3000/graphql',
  });
}

export function resetWebsocketConnection(): void {
  if (wsClient) {
    wsClient.dispose();
  }
  wsClient = createWsClient();
}

function makeServerSideLink(req: any, res: any) {
  return new GraphileApolloLink({
    req,
    res,
    postgraphileMiddleware: req.app.get('postgraphileMiddleware'),
  });
}

function makeClientSideLink() {
  const nextDataEl = document.getElementById('__NEXT_DATA__');
  if (!nextDataEl || !nextDataEl.textContent) {
    throw new Error('Cannot read from __NEXT_DATA__ element');
  }
  const data = JSON.parse(nextDataEl.textContent);
  const CSRF_TOKEN = data.query.CSRF_TOKEN;
  const httpLink = new HttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
    headers: {
      'CSRF-Token': CSRF_TOKEN,
    },
  });
  wsClient = createWsClient();
  const wsLink = new WebSocketLink();

  // Using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent.
  const mainLink = split(
    // split based on operation type
    ({ query, operationName }) => {
      const op = getOperationAST(query, operationName);
      return (op && op.operation === 'subscription') || false;
    },
    wsLink,
    httpLink,
  );
  return mainLink;
}

export const withApollo = withApolloBase(
  ({ initialState, ctx }) => {
    const onErrorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: message: ${message}, location: ${JSON.stringify(
              locations,
            )}, path: ${JSON.stringify(path)}`,
          ),
        );
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    });

    const { req, res }: any = ctx || {};
    const isServer = typeof window === 'undefined';
    const mainLink =
      isServer && req && res
        ? makeServerSideLink(req, res)
        : makeClientSideLink();

    const client = new ApolloClient({
      link: ApolloLink.from([onErrorLink, mainLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            queryType: true,
            fields: {
              posts: relayStylePagination(),
            },
          },
        },
      }).restore(initialState || {}),
    });

    return client;
  },
  {
    getDataFromTree,
  },
);
