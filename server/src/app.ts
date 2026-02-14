import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler';
import { profileRoutes } from './routes/profile';
import { digestRoutes } from './routes/digest';
import { deepdiveRoutes } from './routes/deepdive';
import { challengeRoutes } from './routes/challenge';
import { historyRoutes } from './routes/history';
import { favoritesRoutes } from './routes/favorites';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/profile', profileRoutes);
  app.use('/api/digest', digestRoutes);
  app.use('/api/deepdive', deepdiveRoutes);
  app.use('/api/challenge', challengeRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/favorites', favoritesRoutes);

  app.use(errorHandler);

  return app;
}
