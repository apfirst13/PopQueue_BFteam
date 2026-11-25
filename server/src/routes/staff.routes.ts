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
  (req, res, next) => staffController.startUnboxing(req, res, next),
);

// POST /api/staff/tickets/:id/no-show - Mark CALLED ticket as No-Show after 120s (F-06, AC-42..43)
staffRouter.post(
  '/tickets/:id/no-show',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (req, res, next) => staffController.noShow(req, res, next),
);

// POST /api/staff/tickets/:id/complete - Complete Unboxing (F-03, AC-27..30)
staffRouter.post(
  '/tickets/:id/complete',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (req, res, next) => staffController.complete(req, res, next),
);

// PATCH /api/staff/series/:id/status - Toggle Series Availability Status (F-09, AC-46.1..46.5)
staffRouter.patch(
  '/series/:id/status',
  authenticateToken,
  requireRole([Role.BOX_MASTER]),
  (req, res, next) => staffController.updateSeriesStatus(req, res, next),
);
