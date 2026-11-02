import { Router, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

export const staffRouter = Router();

// GET /api/staff/tickets - Staff Service Counter Discovery (F-03, AC-21)
staffRouter.get(
  '/tickets',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (_req: Request, res: Response) => {
    res.status(501).json({
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented', statusCode: 501 },
    });
  },
);

// POST /api/staff/call-next - FIFO Call Next Queue Ticket (F-03, AC-22..25, AC-32)
staffRouter.post(
  '/call-next',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (_req: Request, res: Response) => {
    res.status(501).json({
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented', statusCode: 501 },
    });
  },
);
