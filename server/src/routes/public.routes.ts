import { Router } from 'express';
import { publicController } from '../controllers/public.controller.js';

export const publicRouter = Router();

// GET /api/public/queue-board - Public Queue Display Board (F-07, AC-44.1..44.8)
publicRouter.get('/queue-board', (req, res, next) =>
  publicController.getQueueBoard(req, res, next),
);
