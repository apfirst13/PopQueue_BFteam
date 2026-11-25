import { apiClient } from './client.js';
import { CancelTicketResponse, JoinQueueResponse, MyTicketResponse } from '../types/index.js';

export async function joinQueue(seriesId: string): Promise<JoinQueueResponse> {
  return apiClient<JoinQueueResponse>('/api/tickets/join', {
    method: 'POST',
    body: JSON.stringify({ seriesId }),
  });
}

export async function getMyTicket(): Promise<MyTicketResponse> {
  return apiClient<MyTicketResponse>('/api/tickets/my-ticket', {
    method: 'GET',
  });
}

export async function cancelTicket(ticketId: string): Promise<CancelTicketResponse> {
  return apiClient<CancelTicketResponse>(`/api/tickets/${ticketId}/cancel`, {
    method: 'POST',
  });
}
