import path from 'path';
import { postgraphql, makePluginHook } from 'postgraphile';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter';
import PgPubsub from '@graphile/pg-pubsub';
import { NodePlugin } from 'graphile-build';
import { decode } from 'next-auth/jwt';
import cookie from 'cookie';

import RemoveQueryQueryPlugin from '../plugins/RemoveQueryQueryPlugin';
import PrimaryKeyMutationsOnlyPlugin from '../plugins/PrimaryKeyMutationsOnlyPlugin';

import { isDev, DB_VISITOR, ownerConnectionString } from '../utils/env';
import { authPgPool } from '../utils/db';

// https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options
const middleware = postgraphql(authPgPool, 'app_public', {
  watchPg: isDev,
  retryOnInitFail: !isDev,
  ownerConnectionString,
  subscriptions: true,
  websocketMiddlewares: [],
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: isDev,
  extendedErrors: isDev
    ? [
        'errcode',
        'severity',
        'detail',
        'hint',
        'positon',
        'internalPosition',
        'internalQuery',
        'where',
        'schema',
        'table',
        'column',
        'dataType',
        'constraint',
      ]
    : ['errcode'],
  appendPlugins: [
    RemoveQueryQueryPlugin,
    PgSimplifyInflectorPlugin,
    PrimaryKeyMutationsOnlyPlugin,
    ConnectionFilterPlugin,
  ],
  skipPlugins: [NodePlugin],
  exportGqlSchemaPath: isDev
    ? path.resolve(__dirname, '../data/schema.graphql')
    : undefined,
  graphiql: isDev,
  enhanceGraphiql: isDev,
  enableQueryBatching: true,
  disableQueryLog: !isDev,
  legacyRelations: 'omit',
  pgSettings: async (req) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const payload = await decode({
      token: cookies['next-auth.session-token'],
      secret: process.env.NEXTAUTH_SECRET || '',
    });
    const userId = (payload as { user: { id: string } })?.user?.id ?? '';
    return {
      // Everyone uses the "visitor" role currently
      role: DB_VISITOR,
      'jwt.claims.user_id': userId,
    };
  },
  allowExplain: isDev,
  pluginHook: makePluginHook([PgPubsub]),
  simpleSubscriptions: true,
  graphileBuildOptions: {
    connectionFilterAllowedOperators: [
      'isNull',
      'equalTo',
      'notEqualTo',
      'distinctFrom',
      'notDistinctFrom',
      'lessThan',
      'lessThanOrEqualTo',
      'greaterThan',
      'greaterThanOrEqualTo',
      'in',
      'notIn',
    ],
  },
});

export default middleware;
