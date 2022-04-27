import pg from 'pg';
import 'dotenv/config';

import exec from './utils/exec';

const DB_TYPE = process.env.DB_TYPE || 'postgres';

const DB_ROOT_URL = process.env.DB_ROOT_URL;

const DB_NAME = process.env.DB_NAME;

const DB_OWNER = process.env.DB_OWNER;
const DB_OWNER_PASSWORD = process.env.DB_OWNER_PASSWORD;

const DB_AUTHENTICATOR = process.env.DB_AUTHENTICATOR;
const DB_AUTHENTICATOR_PASSWORD = process.env.DB_AUTHENTICATOR_PASSWORD;

const DB_VISITOR = process.env.DB_VISITOR;

(async () => {
  const pgPool = new pg.Pool({ connectionString: DB_ROOT_URL });

  pgPool.on('error', (error) => console.log('pgPool error:', error.message));

  await pgPool.query('select true as "Connection test";');

  const client = await pgPool.connect();

  try {
    // RESET database
    await client.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);
    await client.query(`DROP DATABASE IF EXISTS ${DB_NAME}_shadow;`);
    await client.query(`DROP DATABASE IF EXISTS ${DB_NAME}_test;`);
    if (DB_TYPE === 'postgres') {
      await client.query(`DROP ROLE IF EXISTS ${DB_OWNER};`);
    }
    await client.query(`DROP ROLE IF EXISTS ${DB_AUTHENTICATOR};`);
    await client.query(`DROP ROLE IF EXISTS ${DB_VISITOR};`);

    // Now to set up the database cleanly:
    // Ref: https://devcenter.heroku.com/articles/heroku-postgresql#connection-permissions

    // This is the root role for the database`);
    if (DB_TYPE === 'postgres') {
      await client.query(
        // IMPORTANT: don't grant SUPERUSER in production, we only need this so we can load the watch fixtures!
        `CREATE ROLE ${DB_OWNER} WITH LOGIN PASSWORD '${DB_OWNER_PASSWORD}' SUPERUSER;`,
      );
    }

    if (DB_TYPE === 'postgres') {
      // This is the no-access role that PostGraphile will run as by default`);
      await client.query(
        `CREATE ROLE ${DB_AUTHENTICATOR} WITH LOGIN PASSWORD '${DB_AUTHENTICATOR_PASSWORD}' NOINHERIT;`,
      );
    } else {
      await client.query(
        `CREATE ROLE ${DB_AUTHENTICATOR} WITH LOGIN PASSWORD '${DB_AUTHENTICATOR_PASSWORD}';`,
      );
    }

    // This is the role that PostGraphile will switch to (from ${DB_AUTHENTICATOR}) during a GraphQL request
    await client.query(`CREATE ROLE ${DB_VISITOR};`);

    // This enables PostGraphile to switch from ${DB_AUTHENTICATOR} to ${DB_VISITOR}
    await client.query(`GRANT ${DB_VISITOR} TO ${DB_AUTHENTICATOR};`);
  } finally {
    await client.release();
  }

  await pgPool.end();

  await exec('npm', ['run', 'gm', '--', 'reset', '--erase']);
  await exec('npm', ['run', 'gm', '--', 'reset', '--shadow', '--erase']);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
