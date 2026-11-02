import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error-handler.js';
import { callNextSchema } from '../schemas/staff.schema.js';
import { staffService } from '../services/staff.service.js';
import { defaultClock } from '../utils/clock.js';

export class StaffController {
  async getStaffTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const data = await staffService.getStaffTickets(req.user.id);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async callNext(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const parseResult = callNextSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed: seriesId must be a valid UUID');
      }

      const clock = req.app.locals.clock ?? defaultClock;
      const data = await staffService.callNext(req.user.id, parseResult.data.seriesId, clock);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

export const staffController = new StaffController();
