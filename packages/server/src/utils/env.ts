export const isDev = process.env.NODE_ENV === 'development';

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;

export const DB_OWNER = process.env.DB_OWNER;
export const DB_OWNER_PASSWORD = process.env.DB_OWNER_PASSWORD;
export const ownerConnectionString = `postgres://${DB_OWNER}:${DB_OWNER_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const DB_AUTHENTICATOR = process.env.DB_AUTHENTICATOR;
export const DB_AUTHENTICATOR_PASSWORD = process.env.DB_AUTHENTICATOR_PASSWORD;
export const authenticatorConnectionString = `postgres://${DB_AUTHENTICATOR}:${DB_AUTHENTICATOR_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const DB_VISITOR = process.env.DB_VISITOR;
