import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { initializeContainer } from './initialize-container';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({ path: '../.env' });

async function setupRoutes(app: Application) {
  const { authStrava } = app.get('container');

  app.use('/auth', authStrava.getRouter());
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
}

export default async function createApp(): Promise<express.Application> {
  const app = express();

  const container = await initializeContainer();
  app.set('container', container);
  app.set('port', process.env.PORT || 3333);
  app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  const corsOptions = {
    origin: '*',
  };
  app.use(cors(corsOptions));

  await setupRoutes(app);
  return app;
}
