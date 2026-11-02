import { apiClient } from './client.js';
import { JoinQueueResponse, MyTicketResponse } from '../types/index.js';

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
