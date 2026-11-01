export interface Clock {
  now(): Date;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class FakeClock implements Clock {
  private currentTime: Date;

  constructor(initialTime: Date = new Date()) {
    this.currentTime = new Date(initialTime);
  }

  now(): Date {
    return new Date(this.currentTime);
  }

  setTime(time: Date): void {
    this.currentTime = new Date(time);
  }

  advance(ms: number): void {
    this.currentTime = new Date(this.currentTime.getTime() + ms);
  }
}

export const defaultClock: Clock = new SystemClock();

/**
 * Returns the queue date string formatted as YYYY-MM-DD in Asia/Bangkok (UTC+7)
 */
export function getQueueDate(dateInput: Date = defaultClock.now()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(dateInput);
}

/**
 * Returns a Date object representing midnight (00:00:00.000Z) of the queue date in Asia/Bangkok
 * suitable for Prisma @db.Date fields
 */
export function getQueueDateAsDate(dateInput: Date = defaultClock.now()): Date {
  const dateStr = getQueueDate(dateInput);
  return new Date(`${dateStr}T00:00:00.000Z`);
}
