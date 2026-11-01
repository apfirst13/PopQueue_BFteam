import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { errorHandler } from './middleware/error-handler.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // Authentication & Role Identity routes (F-01)
  app.use('/api/auth', authRouter);

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
