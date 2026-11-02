import { Prisma, TicketStatus } from '@prisma/client';
import { prisma } from '../config/db.js';
import { AppError } from '../middleware/error-handler.js';
import { Clock, defaultClock } from '../utils/clock.js';

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
}

export const staffService = new StaffService();
