import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error-handler.js';
import { joinQueueSchema, ticketIdParamSchema } from '../schemas/ticket.schema.js';
import { ticketService } from '../services/ticket.service.js';
import { defaultClock } from '../utils/clock.js';

export class TicketController {
  async joinQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const parseResult = joinQueueSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed: seriesId must be a valid UUID');
      }

      const clock = req.app.locals.clock ?? defaultClock;
      const data = await ticketService.joinQueue(req.user.id, parseResult.data.seriesId, clock);

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getMyTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const clock = req.app.locals.clock ?? defaultClock;
      const data = await ticketService.getMyActiveTicket(req.user.id, clock);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getTicketById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const parseResult = ticketIdParamSchema.safeParse(req.params);
      if (!parseResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Validation failed: ticket id must be a valid UUID');
      }

      const data = await ticketService.getTicketById(parseResult.data.id, req.user);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

export const ticketController = new TicketController();
