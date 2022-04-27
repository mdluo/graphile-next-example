/**
 * Graphile Migrate configuration.
 * https://github.com/graphile/migrate#configuration
 *
 * This file is version tracked, do not add any secrets (passwords, etc) to it
 * - manage these with environmental variables instead.
 */
require('dotenv').config();

const DB_ROOT_URL = process.env.DB_ROOT_URL;

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const DB_OWNER = process.env.DB_OWNER;
const DB_OWNER_PASSWORD = process.env.DB_OWNER_PASSWORD;

module.exports = {
  connectionString: `postgres://${DB_OWNER}:${DB_OWNER_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  shadowConnectionString: `postgres://${DB_OWNER}:${DB_OWNER_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}_shadow`,
  rootConnectionString: DB_ROOT_URL,
  placeholders: {
    ':DB_NAME': '!ENV',
    ':DB_OWNER': '!ENV',
    ':DB_AUTHENTICATOR': '!ENV',
    ':DB_VISITOR': '!ENV',
  },
  afterReset: ['!afterReset.sql'],
};
