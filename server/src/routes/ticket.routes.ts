import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { ticketController } from '../controllers/ticket.controller.js';

export const ticketRouter = Router();

// POST /api/tickets/join - Safe Queue Joining (F-02, AC-10..18)
ticketRouter.post(
  '/join',
  authenticateToken,
  requireRole([Role.COLLECTOR]),
  (req, res, next) => ticketController.joinQueue(req, res, next),
);
