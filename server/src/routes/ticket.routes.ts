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

// GET /api/tickets/my-ticket - Active Ticket Inspection (F-04, AC-34, AC-35)
ticketRouter.get(
  '/my-ticket',
  authenticateToken,
  requireRole([Role.COLLECTOR]),
  (req, res, next) => ticketController.getMyTicket(req, res, next),
);

// GET /api/tickets/:id - Ticket Details by ID (F-04, AC-36..38)
ticketRouter.get(
  '/:id',
  authenticateToken,
  requireRole([Role.COLLECTOR, Role.BOX_MASTER]),
  (req, res, next) => ticketController.getTicketById(req, res, next),
);

