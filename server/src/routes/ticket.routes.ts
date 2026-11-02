import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/auth.js';
import { Role } from '@prisma/client';

export const ticketRouter = Router();

// Stub for POST /api/tickets/join (F-02, AC-10..18)
ticketRouter.post(
  '/join',
  authenticateToken,
  requireRole([Role.COLLECTOR]),
  (_req: Request, res: Response) => {
    res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented', statusCode: 501 } });
  },
);
