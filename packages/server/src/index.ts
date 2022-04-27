import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import chalk from 'chalk';

import PostGraphileMiddleware from './middlewares/PostGraphile';
import { isDev } from './utils/env';
import packageJson from '../package.json';

const httpServer = createServer();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(PostGraphileMiddleware);

app.set('httpServer', httpServer);

httpServer.addListener('request', app);

const PORT = parseInt(process.env.PORT || '', 10) || 3000;
httpServer.listen(PORT, () => {
  const address = httpServer.address();
  const actualPort: string =
    typeof address === 'string'
      ? address
      : address && address.port
      ? String(address.port)
      : String(PORT);
  console.log();
  console.log(
    chalk.green(
      `${chalk.bold(packageJson.name)} listening on port ${chalk.bold(
        actualPort,
      )}`,
    ),
  );
  console.log();
  if (isDev) {
    console.log(
      `GraphiQL:\t${chalk.bold.underline(
        `http://localhost:${actualPort}/graphiql`,
      )}`,
    );
  }
  console.log(
    `GraphQL:\t${chalk.bold.underline(
      `http://localhost:${actualPort}/graphql`,
    )}`,
  );
  console.log();
});
