import { apiClient } from './client.js';
import { PublicQueueBoardResponse } from '../types/index.js';

export async function getPublicQueueBoard(): Promise<PublicQueueBoardResponse> {
  return apiClient<PublicQueueBoardResponse>('/api/public/queue-board', {
    method: 'GET',
  });
}
