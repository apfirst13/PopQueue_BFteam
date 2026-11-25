import { Request, Response, NextFunction } from 'express';
import { publicService } from '../services/public.service.js';
import { defaultClock } from '../utils/clock.js';

export class PublicController {
  async getQueueBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clock = req.app.locals.clock ?? defaultClock;
      const data = await publicService.getQueueBoard(clock);
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

export const publicController = new PublicController();
