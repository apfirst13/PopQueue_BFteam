import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { seriesRouter } from './routes/series.routes.js';
import { ticketRouter } from './routes/ticket.routes.js';
import { staffRouter } from './routes/staff.routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { Clock, defaultClock } from './utils/clock.js';

export interface AppOptions {
  clock?: Clock;
}

export function createApp(options: AppOptions = {}): Express {
  const app = express();
  const clock = options.clock ?? defaultClock;

  // Attach clock to request or app locals for downstream handlers
  app.locals.clock = clock;

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // Authentication & Role Identity routes (F-01)
  app.use('/api/auth', authRouter);

  // Queue Discovery & Safe Joining routes (F-02)
  app.use('/api/series', seriesRouter);
  app.use('/api/tickets', ticketRouter);

  // Box Master Service Counter routes (F-03)
  app.use('/api/staff', staffRouter);

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
