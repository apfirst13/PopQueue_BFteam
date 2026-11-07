import { Prisma, Role, TicketStatus } from '@prisma/client';
import { prisma } from '../config/db.js';
import { AppError } from '../middleware/error-handler.js';
import { Clock, defaultClock, getQueueDate, getQueueDateAsDate } from '../utils/clock.js';

export interface JoinQueueResult {
  ticketId: string;
  displayNumber: string;
  queueNumber: number;
  queueDate: string;
  status: TicketStatus;
  seriesName: string;
  createdAt: string;
}

export interface ActiveTicketResult {
  ticket: {
    id: string;
    displayNumber: string;
    queueNumber: number;
    status: TicketStatus;
    waitingAhead: number;
    series: {
      id: string;
      code: string;
      name: string;
    };
    createdAt: string;
    calledAt: string | null;
    startedAt: string | null;
  };
}

export interface TicketDetailResult {
  id: string;
  displayNumber: string;
  status: TicketStatus;
  series: {
    id: string;
    code: string;
    name: string;
  };
  userFullName?: string;
  createdAt: string;
  calledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface TicketUserIdentity {
  id: string;
  role: Role;
}

export class TicketService {
  async joinQueue(
    userId: string,
    seriesId: string,
    clock: Clock = defaultClock,
  ): Promise<JoinQueueResult> {
    const now = clock.now();
    const todayDate = getQueueDateAsDate(now);
    const queueDateStr = getQueueDate(now);

    // 1. Existence check
    const series = await prisma.series.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Series not found');
    }

    // 2. Closed series check
    if (!series.isActive) {
      throw new AppError(409, 'SERIES_CLOSED', 'Series is currently closed');
    }

    // 3. Atomic transaction: Raw SQL counter increment + Ticket creation
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Atomic increment of QueueCounter using PostgreSQL raw SQL (D-10, BR-01)
        const counterRows = await tx.$queryRaw<Array<{ lastNumber: number }>>`
          INSERT INTO "QueueCounter" ("id", "seriesId", "queueDate", "lastNumber")
          VALUES (gen_random_uuid()::text, ${seriesId}, ${queueDateStr}::date, 1)
          ON CONFLICT ("seriesId", "queueDate")
          DO UPDATE SET "lastNumber" = "QueueCounter"."lastNumber" + 1
          RETURNING "lastNumber";
        `;

        const queueNumber = Number(counterRows[0].lastNumber);
        const displayNumber = `${series.code}-${String(queueNumber).padStart(3, '0')}`;

        // Insert ticket. If user already has an active ticket, unique_active_ticket_user triggers P2002
        const ticket = await tx.queueTicket.create({
          data: {
            userId,
            seriesId,
            queueNumber,
            displayNumber,
            queueDate: todayDate,
            status: TicketStatus.WAITING,
          },
        });

        return {
          ticketId: ticket.id,
          displayNumber: ticket.displayNumber,
          queueNumber: ticket.queueNumber,
          queueDate: queueDateStr,
          status: ticket.status,
          seriesName: series.name,
          createdAt: ticket.createdAt.toISOString(),
        };
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const metaTarget = (error.meta?.target as string[] | string | undefined) || '';
        const targetStr = Array.isArray(metaTarget) ? metaTarget.join(',') : String(metaTarget);

        if (
          targetStr.includes('userId') ||
          targetStr.includes('unique_active_ticket_user') ||
          error.message?.includes('unique_active_ticket_user')
        ) {
          throw new AppError(
            409,
            'DUPLICATE_ACTIVE_QUEUE',
            'User already has an active queue ticket',
          );
        }
      }

      throw error;
    }
  }

  /**
   * Retrieves active ticket for current collector with waitingAhead calculation (AC-34, AC-35, FR-05)
   */
  async getMyActiveTicket(
    userId: string,
    _clock: Clock = defaultClock,
  ): Promise<ActiveTicketResult> {
    const activeTicket = await prisma.queueTicket.findFirst({
      where: {
        userId,
        status: {
          in: [TicketStatus.WAITING, TicketStatus.CALLED, TicketStatus.UNBOXING],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        series: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    if (!activeTicket) {
      throw new AppError(404, 'NO_ACTIVE_TICKET', 'No active queue ticket found');
    }

    let waitingAhead = 0;
    if (activeTicket.status === TicketStatus.WAITING) {
      waitingAhead = await prisma.queueTicket.count({
        where: {
          seriesId: activeTicket.seriesId,
          queueDate: activeTicket.queueDate,
          status: TicketStatus.WAITING,
          queueNumber: {
            lt: activeTicket.queueNumber,
          },
        },
      });
    }

    return {
      ticket: {
        id: activeTicket.id,
        displayNumber: activeTicket.displayNumber,
        queueNumber: activeTicket.queueNumber,
        status: activeTicket.status,
        waitingAhead,
        series: {
          id: activeTicket.series.id,
          code: activeTicket.series.code,
          name: activeTicket.series.name,
        },
        createdAt: activeTicket.createdAt.toISOString(),
        calledAt: activeTicket.calledAt?.toISOString() ?? null,
        startedAt: activeTicket.startedAt?.toISOString() ?? null,
      },
    };
  }

  /**
   * Retrieves ticket details by ID with strict ownership and scope verification (AC-36..38, FR-06)
   */
  async getTicketById(
    ticketId: string,
    user: TicketUserIdentity,
  ): Promise<TicketDetailResult> {
    // 1. Minimal select to check existence (404) and ownership/scope (403) before loading details
    const minimal = await prisma.queueTicket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        userId: true,
        seriesId: true,
      },
    });

    if (!minimal) {
      throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Ticket not found');
    }

    // 2. Ownership / Series Scope Guard
    if (user.role === Role.COLLECTOR) {
      if (minimal.userId !== user.id) {
        throw new AppError(
          403,
          'FORBIDDEN_OWNERSHIP',
          'Forbidden: You do not have permission to view this ticket',
        );
      }
    } else if (user.role === Role.BOX_MASTER) {
      const assignment = await prisma.staffSeriesAssignment.findUnique({
        where: {
          staffId_seriesId: {
            staffId: user.id,
            seriesId: minimal.seriesId,
          },
        },
      });

      if (!assignment) {
        throw new AppError(
          403,
          'FORBIDDEN_SERIES',
          'Forbidden: Ticket belongs to a series outside your assignment',
        );
      }
    }

    // 3. Authorized: Load full details with series and user
    const ticket = await prisma.queueTicket.findUniqueOrThrow({
      where: { id: ticketId },
      include: {
        series: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    const result: TicketDetailResult = {
      id: ticket.id,
      displayNumber: ticket.displayNumber,
      status: ticket.status,
      series: {
        id: ticket.series.id,
        code: ticket.series.code,
        name: ticket.series.name,
      },
      createdAt: ticket.createdAt.toISOString(),
      calledAt: ticket.calledAt?.toISOString() ?? null,
      startedAt: ticket.startedAt?.toISOString() ?? null,
      completedAt: ticket.completedAt?.toISOString() ?? null,
    };

    if (user.role === Role.BOX_MASTER) {
      result.userFullName = ticket.user.fullName;
    }

    return result;
  }
}

export const ticketService = new TicketService();

