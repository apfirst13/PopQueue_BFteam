import { TicketStatus } from '@prisma/client';
import { prisma } from '../config/db.js';
import { Clock, defaultClock } from '../utils/clock.js';

export const UP_NEXT_LIMIT = 5;

export interface PublicNowServingItem {
  displayNumber: string;
  status: 'CALLED' | 'UNBOXING';
}

export interface PublicUpNextItem {
  queueNumber: number;
  displayNumber: string;
}

export interface PublicSeriesBoard {
  seriesCode: string;
  seriesName: string;
  isActive: boolean;
  nowServing: PublicNowServingItem[];
  upNext: PublicUpNextItem[];
  waitingCount: number;
}

export interface PublicQueueBoardDto {
  timestamp: string;
  boards: PublicSeriesBoard[];
}

export class PublicService {
  /**
   * Builds the PII-free public queue display board payload aligned with call-next FIFO ordering.
   */
  async getQueueBoard(clock: Clock = defaultClock): Promise<PublicQueueBoardDto> {
    const [seriesList, servingTickets, waitingTickets] = await Promise.all([
      prisma.series.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          isActive: true,
        },
        orderBy: { code: 'asc' },
      }),
      // Strict Prisma select projection (NFR-02): zero PII fields queried
      prisma.queueTicket.findMany({
        where: {
          status: {
            in: [TicketStatus.CALLED, TicketStatus.UNBOXING],
          },
        },
        select: {
          seriesId: true,
          displayNumber: true,
          status: true,
        },
        orderBy: [
          { calledAt: 'asc' },
          { queueDate: 'asc' },
          { queueNumber: 'asc' },
        ],
      }),
      // Dataset matches call-next FIFO (no queueDate filter per FACTS F6)
      prisma.queueTicket.findMany({
        where: {
          status: TicketStatus.WAITING,
        },
        select: {
          seriesId: true,
          queueNumber: true,
          displayNumber: true,
        },
        orderBy: [
          { queueDate: 'asc' },
          { queueNumber: 'asc' },
        ],
      }),
    ]);

    const servingBySeries = new Map<string, PublicNowServingItem[]>();
    for (const ticket of servingTickets) {
      const list = servingBySeries.get(ticket.seriesId) ?? [];
      list.push({
        displayNumber: ticket.displayNumber,
        status: ticket.status as 'CALLED' | 'UNBOXING',
      });
      servingBySeries.set(ticket.seriesId, list);
    }

    const waitingBySeries = new Map<string, PublicUpNextItem[]>();
    for (const ticket of waitingTickets) {
      const list = waitingBySeries.get(ticket.seriesId) ?? [];
      list.push({
        queueNumber: ticket.queueNumber,
        displayNumber: ticket.displayNumber,
      });
      waitingBySeries.set(ticket.seriesId, list);
    }

    const boards: PublicSeriesBoard[] = [];
    for (const series of seriesList) {
      const nowServing = servingBySeries.get(series.id) ?? [];
      const allWaiting = waitingBySeries.get(series.id) ?? [];
      const waitingCount = allWaiting.length;

      // DEC-04: Hide closed series with zero active tickets
      if (!series.isActive && waitingCount === 0 && nowServing.length === 0) {
        continue;
      }

      boards.push({
        seriesCode: series.code,
        seriesName: series.name,
        isActive: series.isActive,
        nowServing,
        upNext: allWaiting.slice(0, UP_NEXT_LIMIT),
        waitingCount,
      });
    }

    return {
      timestamp: clock.now().toISOString(),
      boards,
    };
  }
}

export const publicService = new PublicService();
