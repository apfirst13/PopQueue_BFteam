import { Request, Response, NextFunction } from 'express';
import { seriesService } from '../services/series.service.js';
import { defaultClock } from '../utils/clock.js';

export class SeriesController {
  async getSeries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clock = req.app.locals.clock ?? defaultClock;
      const data = await seriesService.getAllSeries(clock);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

export const seriesController = new SeriesController();
