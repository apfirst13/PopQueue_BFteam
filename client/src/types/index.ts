export type Role = 'COLLECTOR' | 'BOX_MASTER';

export type TicketStatus = 'WAITING' | 'CALLED' | 'UNBOXING' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
}

// POST /api/auth/login -> 200
export interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}

// POST /api/auth/logout -> 200
export interface LogoutResponse {
  data: {
    success: boolean;
  };
}

// GET /api/auth/me -> 200
export interface MeResponse {
  data: {
    id: string;
    username: string;
    fullName: string;
    role: Role;
    assignedSeries: Array<{
      id: string;
      code: string;
      name: string;
    }>;
  };
}

// GET /api/series -> 200
export interface SeriesDiscoveryItem {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  waitingCount: number;
}

export interface SeriesListResponse {
  data: SeriesDiscoveryItem[];
}

// POST /api/tickets/join -> 201
export interface JoinQueueResponse {
  data: {
    ticketId: string;
    displayNumber: string;
    queueNumber: number;
    queueDate: string;
    status: TicketStatus;
    seriesName: string;
    createdAt: string;
  };
}

// GET /api/tickets/my-ticket -> 200
export interface ActiveTicket {
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
}

export interface MyTicketResponse {
  data: {
    ticket: ActiveTicket;
  };
}

// GET /api/staff/tickets -> 200
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

export interface StaffTicketsResponse {
  data: {
    series: StaffSeriesQueueDto[];
  };
}

// POST /api/staff/call-next -> 200
export interface CallNextResponse {
  data: {
    ticketId: string;
    displayNumber: string;
    status: TicketStatus;
    handledByStaffId: string | null;
    calledAt: string;
  };
}

// POST /api/staff/tickets/:id/start-unboxing -> 200
export interface StartUnboxingResponse {
  data: {
    ticketId: string;
    status: TicketStatus;
    startedAt: string;
  };
}

// POST /api/staff/tickets/:id/complete -> 200
export interface CompleteTicketResponse {
  data: {
    ticketId: string;
    status: TicketStatus;
    completedAt: string;
  };
}

// Standard Error Envelope
export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
