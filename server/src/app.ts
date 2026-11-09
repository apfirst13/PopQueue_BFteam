import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { authRouter } from './routes/auth.routes.js';
import { seriesRouter } from './routes/series.routes.js';
import { ticketRouter } from './routes/ticket.routes.js';
import { staffRouter } from './routes/staff.routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { Clock, defaultClock } from './utils/clock.js';
import { prisma } from './config/db.js';

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

  // Health check endpoints (supports both /api/v1/health and /api/health)
  app.get(['/api/health', '/api/v1/health'], (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // Readiness check endpoint (verifies database connectivity)
  app.get('/api/ready', async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ db: 'connected' });
    } catch (err) {
      res.status(503).json({ db: 'disconnected', error: (err as Error).message });
    }
  });

  // Authentication & Role Identity routes (F-01)
  app.use('/api/auth', authRouter);

  // Queue Discovery & Safe Joining routes (F-02)
  app.use('/api/series', seriesRouter);
  app.use('/api/tickets', ticketRouter);

  // Box Master Service Counter routes (F-03)
  app.use('/api/staff', staffRouter);

  // Serve static frontend assets in production container if client dist exists
  const clientDist = process.env.CLIENT_DIST_DIR || path.resolve(process.cwd(), '../client/dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
