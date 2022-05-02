import { createServer } from 'http';
import express from 'express';
import next from 'next';
import chalk from 'chalk';

import PostGraphileMiddleware from './middlewares/PostGraphile';
import { isDev } from './utils/env';
import packageJson from '../package.json';

const nextApp = next({ dev: isDev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const httpServer = createServer();

  const app = express();

  app.use(PostGraphileMiddleware);

  app.all('*', (req, res) => {
    return nextHandler(req, res);
  });

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
    console.log(
      `App:\t\t${chalk.bold.underline(`http://localhost:${actualPort}`)}`,
    );
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
});
