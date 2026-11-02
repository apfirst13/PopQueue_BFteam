import { Prisma, TicketStatus } from '@prisma/client';
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
}

export const ticketService = new TicketService();
