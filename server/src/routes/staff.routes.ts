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
