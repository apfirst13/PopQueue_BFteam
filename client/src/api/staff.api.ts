import { apiClient } from './client.js';
import {
  StaffTicketsResponse,
  CallNextResponse,
  StartUnboxingResponse,
  CompleteTicketResponse,
} from '../types/index.js';

export async function getStaffTickets(): Promise<StaffTicketsResponse> {
  return apiClient<StaffTicketsResponse>('/api/staff/tickets', {
    method: 'GET',
  });
}

export async function callNext(seriesId: string): Promise<CallNextResponse> {
  return apiClient<CallNextResponse>('/api/staff/call-next', {
    method: 'POST',
    body: JSON.stringify({ seriesId }),
  });
}

export async function startUnboxing(ticketId: string): Promise<StartUnboxingResponse> {
  return apiClient<StartUnboxingResponse>(`/api/staff/tickets/${ticketId}/start-unboxing`, {
    method: 'POST',
  });
}

export async function completeTicket(ticketId: string): Promise<CompleteTicketResponse> {
  return apiClient<CompleteTicketResponse>(`/api/staff/tickets/${ticketId}/complete`, {
    method: 'POST',
  });
}
