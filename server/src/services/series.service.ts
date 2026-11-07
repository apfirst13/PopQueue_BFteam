import { TicketStatus } from '@prisma/client';
import { prisma } from '../config/db.js';
import { Clock, defaultClock, getQueueDateAsDate } from '../utils/clock.js';

export interface SeriesDiscoveryItem {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  waitingCount: number;
}

export class SeriesService {
  async getAllSeries(clock: Clock = defaultClock): Promise<SeriesDiscoveryItem[]> {
    const todayDate = getQueueDateAsDate(clock.now());

    const seriesList = await prisma.series.findMany({
      orderBy: { code: 'asc' },
      include: {
        tickets: {
          where: {
            status: TicketStatus.WAITING,
            queueDate: todayDate,
          },
          select: { id: true },
        },
      },
    });

    return seriesList.map((series) => ({
      id: series.id,
      code: series.code,
      name: series.name,
      isActive: series.isActive,
      waitingCount: series.tickets.length,
    }));
  }
}

export const seriesService = new SeriesService();
