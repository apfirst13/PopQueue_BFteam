import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { staffController } from '../controllers/staff.controller.js';

export const staffRouter = Router();

// GET /api/staff/tickets - Staff Service Counter Discovery (F-03, AC-21)
staffRouter.get(
  '/tickets',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (req, res, next) => staffController.getStaffTickets(req, res, next),
);

// POST /api/staff/call-next - FIFO Call Next Queue Ticket (F-03, AC-22..25, AC-32)
staffRouter.post(
  '/call-next',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (req, res, next) => staffController.callNext(req, res, next),
);

// POST /api/staff/tickets/:id/start-unboxing - Start Unboxing (F-03, AC-26..30)
staffRouter.post(
  '/tickets/:id/start-unboxing',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (_req, res) => {
    res.status(501).json({
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented', statusCode: 501 },
    });
  },
);

// POST /api/staff/tickets/:id/complete - Complete Unboxing (F-03, AC-27..30)
staffRouter.post(
  '/tickets/:id/complete',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (_req, res) => {
    res.status(501).json({
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented', statusCode: 501 },
    });
  },
);
