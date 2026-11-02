import { apiClient } from './client.js';
import { SeriesListResponse } from '../types/index.js';

export async function getSeries(): Promise<SeriesListResponse> {
  return apiClient<SeriesListResponse>('/api/series', {
    method: 'GET',
  });
}
