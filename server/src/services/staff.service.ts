import { Prisma, TicketStatus } from '@prisma/client';
import { prisma } from '../config/db.js';
import { AppError } from '../middleware/error-handler.js';
import { Clock, defaultClock } from '../utils/clock.js';
import { canTransition } from '../utils/state-machine.js';

export interface ActiveServingTicketDto {
  id: string;
  displayNumber: string;
  status: TicketStatus;
  calledAt: string | null;
  startedAt: string | null;
}

export interface WaitingQueueTicketDto {
  id: string;
  displayNumber: string;
  queueNumber: number;
  createdAt: string;
  userFullName: string;
}

export interface StaffSeriesQueueDto {
  seriesId: string;
  code: string;
  name: string;
  activeServing: ActiveServingTicketDto | null;
  waitingQueue: WaitingQueueTicketDto[];
}

export interface CallNextResultDto {
  ticketId: string;
  displayNumber: string;
  status: TicketStatus;
  handledByStaffId: string | null;
  calledAt: string;
}

export interface StartUnboxingResultDto {
  ticketId: string;
  status: TicketStatus;
  startedAt: string;
}

export interface CompleteTicketResultDto {
  ticketId: string;
  status: TicketStatus;
  completedAt: string;
}

/**
 * Checks if the caught error represents a violation of unique_active_staff_ticket.
 * Handles both Prisma model update (P2002) and raw query (P2010 / Postgres 23505).
 */
export function isStaffBusyError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      const targetStr = Array.isArray(target) ? target.join(',') : String(target ?? '');
      return (
        targetStr.includes('handledByStaffId') ||
        targetStr.includes('unique_active_staff_ticket') ||
        error.message.includes('unique_active_staff_ticket')
      );
    }
    if (error.code === 'P2010') {
      return (
        error.message.includes('unique_active_staff_ticket') ||
        error.message.includes('23505')
      );
    }
  }
  return false;
}

export class StaffService {
  async getStaffTickets(staffId: string): Promise<{ series: StaffSeriesQueueDto[] }> {
    // 1. Fetch assigned series for this staff member
    const assignments = await prisma.staffSeriesAssignment.findMany({
      where: { staffId },
      include: {
        series: true,
      },
      orderBy: {
        series: { code: 'asc' },
      },
    });

    const seriesResult: StaffSeriesQueueDto[] = [];

    for (const assignment of assignments) {
      // 2. Check active serving ticket for this staff in this series
      const activeServingTicket = await prisma.queueTicket.findFirst({
        where: {
          handledByStaffId: staffId,
          seriesId: assignment.seriesId,
          status: { in: [TicketStatus.CALLED, TicketStatus.UNBOXING] },
        },
      });

      const activeServing: ActiveServingTicketDto | null = activeServingTicket
        ? {
            id: activeServingTicket.id,
            displayNumber: activeServingTicket.displayNumber,
            status: activeServingTicket.status,
            calledAt: activeServingTicket.calledAt?.toISOString() ?? null,
            startedAt: activeServingTicket.startedAt?.toISOString() ?? null,
          }
        : null;

      // 3. Fetch waiting queue ordered by queueDate asc, queueNumber asc (FIFO across days)
      const waitingTickets = await prisma.queueTicket.findMany({
        where: {
          seriesId: assignment.seriesId,
          status: TicketStatus.WAITING,
        },
        orderBy: [
          { queueDate: 'asc' },
          { queueNumber: 'asc' },
        ],
        include: {
          user: {
            select: { fullName: true },
          },
        },
      });

      const waitingQueue: WaitingQueueTicketDto[] = waitingTickets.map((t) => ({
        id: t.id,
        displayNumber: t.displayNumber,
        queueNumber: t.queueNumber,
        createdAt: t.createdAt.toISOString(),
        userFullName: t.user.fullName,
      }));

      seriesResult.push({
        seriesId: assignment.series.id,
        code: assignment.series.code,
        name: assignment.series.name,
        activeServing,
        waitingQueue,
      });
    }

    return { series: seriesResult };
  }

  async callNext(
    staffId: string,
    seriesId: string,
    clock: Clock = defaultClock,
  ): Promise<CallNextResultDto> {
    // 1. Check Series Assignment (BR-05, AC-25)
    const assignment = await prisma.staffSeriesAssignment.findUnique({
      where: {
        staffId_seriesId: {
          staffId,
          seriesId,
        },
      },
    });

    if (!assignment) {
      throw new AppError(403, 'FORBIDDEN_SERIES', 'Staff is not assigned to this series');
    }

    // 2. Staff Busy Pre-check (BR-06, AC-24)
    const activeServing = await prisma.queueTicket.findFirst({
      where: {
        handledByStaffId: staffId,
        status: { in: [TicketStatus.CALLED, TicketStatus.UNBOXING] },
      },
    });

    if (activeServing) {
      throw new AppError(409, 'STAFF_BUSY', 'Staff currently has an active serving ticket');
    }

    // 3. Interactive Transaction: Raw SQL FIFO lock + Model update
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Atomic FIFO lock with FOR UPDATE SKIP LOCKED (Master Part C §4)
        const rows = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "QueueTicket"
          WHERE "seriesId" = ${seriesId} AND "status" = 'WAITING'::"TicketStatus"
          ORDER BY "queueDate" ASC, "queueNumber" ASC
          LIMIT 1
          FOR UPDATE SKIP LOCKED;
        `;

        if (!rows || rows.length === 0) {
          throw new AppError(404, 'EMPTY_QUEUE', 'No waiting tickets available in this series');
        }

        const selectedId = rows[0].id;
        const now = clock.now();

        // Model API update (satisfies unique_active_staff_ticket constraint under concurrency)
        const updated = await tx.queueTicket.update({
          where: { id: selectedId },
          data: {
            status: TicketStatus.CALLED,
            handledByStaffId: staffId,
            calledAt: now,
          },
        });

        return {
          ticketId: updated.id,
          displayNumber: updated.displayNumber,
          status: updated.status,
          handledByStaffId: updated.handledByStaffId,
          calledAt: updated.calledAt?.toISOString() ?? now.toISOString(),
        };
      });

      return result;
    } catch (error: unknown) {
      if (isStaffBusyError(error)) {
        throw new AppError(409, 'STAFF_BUSY', 'Staff currently has an active serving ticket');
      }
      throw error;
    }
  }

  /**
   * Starts unboxing verification for a CALLED ticket (F-03, AC-26, BR-03, BR-07)
   * Evaluation order:
   * 1) Resource existence (404)
   * 2) Series scope (403 FORBIDDEN_SERIES)
   * 3) Handler ownership (403 FORBIDDEN_NOT_HANDLER)
   * 4) State transition validity (400 INVALID_STATE_TRANSITION)
   * 5) Atomic guarded update
   */
  async startUnboxing(
    staffId: string,
    ticketId: string,
    clock: Clock = defaultClock,
  ): Promise<StartUnboxingResultDto> {
    // 1. Resource existence check (404)
    const ticket = await prisma.queueTicket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        seriesId: true,
        status: true,
        handledByStaffId: true,
      },
    });

    if (!ticket) {
      throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Ticket not found');
    }

    // 2. Series scope check (403 FORBIDDEN_SERIES)
    const assignment = await prisma.staffSeriesAssignment.findUnique({
      where: {
        staffId_seriesId: {
          staffId,
          seriesId: ticket.seriesId,
        },
      },
    });

    if (!assignment) {
      throw new AppError(403, 'FORBIDDEN_SERIES', 'Staff is not assigned to this series');
    }

    // 3. Handler ownership check: only if ticket already has a handler (403 FORBIDDEN_NOT_HANDLER)
    if (ticket.handledByStaffId !== null && ticket.handledByStaffId !== staffId) {
      throw new AppError(403, 'FORBIDDEN_NOT_HANDLER', 'Staff is not the handler of this ticket');
    }

    // 4. State transition validity check (400 INVALID_STATE_TRANSITION)
    if (!canTransition(ticket.status, 'START_UNBOXING')) {
      throw new AppError(
        400,
        'INVALID_STATE_TRANSITION',
        'Invalid ticket state transition: ticket must be in CALLED status to start unboxing',
      );
    }

    // 5. Atomic guarded update: single UPDATE ... WHERE id AND status AND handler
    const now = clock.now();
    const result = await prisma.queueTicket.updateMany({
      where: {
        id: ticketId,
        status: TicketStatus.CALLED,
        handledByStaffId: staffId,
      },
      data: {
        status: TicketStatus.UNBOXING,
        startedAt: now,
      },
    });

    if (result.count === 0) {
      throw new AppError(
        400,
        'INVALID_STATE_TRANSITION',
        'Invalid ticket state transition: concurrent state change detected',
      );
    }

    return {
      ticketId,
      status: TicketStatus.UNBOXING,
      startedAt: now.toISOString(),
    };
  }

  /**
   * Completes service for an UNBOXING ticket (F-03, AC-27, BR-03, BR-07)
   * Evaluation order:
   * 1) Resource existence (404)
   * 2) Series scope (403 FORBIDDEN_SERIES)
   * 3) Handler ownership (403 FORBIDDEN_NOT_HANDLER)
   * 4) State transition validity (400 INVALID_STATE_TRANSITION)
   * 5) Atomic guarded update
   */
  async complete(
    staffId: string,
    ticketId: string,
    clock: Clock = defaultClock,
  ): Promise<CompleteTicketResultDto> {
    // 1. Resource existence check (404)
    const ticket = await prisma.queueTicket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        seriesId: true,
        status: true,
        handledByStaffId: true,
      },
    });

    if (!ticket) {
      throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Ticket not found');
    }

    // 2. Series scope check (403 FORBIDDEN_SERIES)
    const assignment = await prisma.staffSeriesAssignment.findUnique({
      where: {
        staffId_seriesId: {
          staffId,
          seriesId: ticket.seriesId,
        },
      },
    });

    if (!assignment) {
      throw new AppError(403, 'FORBIDDEN_SERIES', 'Staff is not assigned to this series');
    }

    // 3. Handler ownership check: only if ticket already has a handler (403 FORBIDDEN_NOT_HANDLER)
    if (ticket.handledByStaffId !== null && ticket.handledByStaffId !== staffId) {
      throw new AppError(403, 'FORBIDDEN_NOT_HANDLER', 'Staff is not the handler of this ticket');
    }

    // 4. State transition validity check (400 INVALID_STATE_TRANSITION)
    if (!canTransition(ticket.status, 'COMPLETE')) {
      throw new AppError(
        400,
        'INVALID_STATE_TRANSITION',
        'Invalid ticket state transition: ticket must be in UNBOXING status to complete',
      );
    }

    // 5. Atomic guarded update: single UPDATE ... WHERE id AND status AND handler
    const now = clock.now();
    const result = await prisma.queueTicket.updateMany({
      where: {
        id: ticketId,
        status: TicketStatus.UNBOXING,
        handledByStaffId: staffId,
      },
      data: {
        status: TicketStatus.COMPLETED,
        completedAt: now,
      },
    });

    if (result.count === 0) {
      throw new AppError(
        400,
        'INVALID_STATE_TRANSITION',
        'Invalid ticket state transition: concurrent state change detected',
      );
    }

    return {
      ticketId,
      status: TicketStatus.COMPLETED,
      completedAt: now.toISOString(),
    };
  }
}

export const staffService = new StaffService();
