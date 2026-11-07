import { Router } from 'express';
import { seriesController } from '../controllers/series.controller.js';

export const seriesRouter = Router();

// GET /api/series - Queue Discovery (F-02, AC-09)
seriesRouter.get('/', (req, res, next) => seriesController.getSeries(req, res, next));
