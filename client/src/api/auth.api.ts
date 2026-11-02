import { apiClient } from './client.js';
import { LoginResponse, LogoutResponse, MeResponse } from '../types/index.js';

export async function login(username: string, password: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function logout(): Promise<LogoutResponse> {
  return apiClient<LogoutResponse>('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getMe(): Promise<MeResponse> {
  return apiClient<MeResponse>('/api/auth/me', {
    method: 'GET',
  });
}
