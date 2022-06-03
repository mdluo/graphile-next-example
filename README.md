# Graphile Next Example

This is a full-stack web app developed with [PostGraphile](https://www.graphile.org/postgraphile/) and [Next.js](https://nextjs.org/),
featuring [NextAuth](https://next-auth.js.org/) for 3rd party account login,
[Apollo Client](https://www.apollographql.com/docs/react/) as the React GraphQL client,
and [BlueprintJS](https://blueprintjs.com/docs/) and [Tailwind CSS](https://tailwindcss.com/docs) as the UI framework.

This app is inspired by [Graphile Starter](https://github.com/graphile/starter), please refer to it for more features and integrations examples.

### Features

- Log in (and sign up) with GitHub and Google accounts.
- Cookie-based JWT tokens for user identification.
- Cursor-based pagination ([Relay style](https://www.apollographql.com/docs/react/pagination/cursor-based/#relay-style-cursor-pagination)).
- Postgres triggers and GraphQL subscription (realtime updates).
- Twitter-like user follow functionality.

### Local development

Requirements:

- [GitHub OAuth App](https://www.apollographql.com/docs/react/pagination/cursor-based/#relay-style-cursor-pagination) and/or [Google OAuth 2.0 Client ID](https://support.google.com/cloud/answer/6158849?hl=en)
- Docker machine and docker-compose (for running Postgres, optional if you installed Postgres natively).
- Node.js (recommend >= 16) and npm (recommend >= 8) or yarn.

##### Step 1. Start Postgres with docker-compose

```sh
docker-compose up -d
```

##### Step 2. Install dependences

```sh
npm ci
```

##### Step 3. Set up `.env` file

```sh
cp .env.example .env
```

And edit the `.env` file to ensure all the missing variables are set. Tip: you can use `openssl rand -base64 30 | tr '+/' '-_'` to generate a random string for passwords and secrets.

##### Step 4. Set up database

```sh
npm run db:init
npm run db:migrate
```

##### Step 5. (You can stop the `npm run db:migrate` once finished) Start the local development server

```sh
npm run dev
```

And got the http://localhost:3000
