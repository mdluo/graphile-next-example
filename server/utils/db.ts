import { Pool } from 'pg';

import { ownerConnectionString, authenticatorConnectionString } from './env';

export const ownerPgPool = new Pool({
  connectionString: ownerConnectionString,
});

export const authPgPool = new Pool({
  connectionString: authenticatorConnectionString,
});
