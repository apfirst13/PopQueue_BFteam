import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error-handler.js';
import {
  callNextSchema,
  staffTicketParamsSchema,
  staffSeriesParamsSchema,
  updateSeriesStatusSchema,
} from '../schemas/staff.schema.js';
import { staffService } from '../services/staff.service.js';
import { defaultClock } from '../utils/clock.js';

export class StaffController {
  async getStaffTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const clock = req.app.locals.clock ?? defaultClock;
      const data = await staffService.getStaffTickets(req.user.id, clock);
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

  async startUnboxing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const parseResult = staffTicketParamsSchema.safeParse(req.params);
      if (!parseResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed: ticket id must be a valid UUID');
      }

      const clock = req.app.locals.clock ?? defaultClock;
      const data = await staffService.startUnboxing(req.user.id, parseResult.data.id, clock);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async noShow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const parseResult = staffTicketParamsSchema.safeParse(req.params);
      if (!parseResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed: ticket id must be a valid UUID');
      }

      const clock = req.app.locals.clock ?? defaultClock;
      const data = await staffService.noShow(req.user.id, parseResult.data.id, clock);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const parseResult = staffTicketParamsSchema.safeParse(req.params);
      if (!parseResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed: ticket id must be a valid UUID');
      }

      const clock = req.app.locals.clock ?? defaultClock;
      const data = await staffService.complete(req.user.id, parseResult.data.id, clock);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateSeriesStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const paramsResult = staffSeriesParamsSchema.safeParse(req.params);
      if (!paramsResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed: series id must be a valid UUID');
      }

      const bodyResult = updateSeriesStatusSchema.safeParse(req.body);
      if (!bodyResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed: isActive must be a boolean');
      }

      const data = await staffService.updateSeriesStatus(
        req.user.id,
        paramsResult.data.id,
        bodyResult.data.isActive,
      );

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

export const staffController = new StaffController();
