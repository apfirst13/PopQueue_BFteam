import { ApiErrorPayload } from '../types/index.js';

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const getBaseUrl = (): string => {
  if (import.meta.env && typeof import.meta.env.VITE_API_URL === 'string') {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:4000';
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const token = localStorage.getItem('popqueue_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorPayload: ApiErrorPayload | null = null;
    try {
      errorPayload = (await response.json()) as ApiErrorPayload;
    } catch {
      // not JSON
    }

    const code = errorPayload?.error?.code || 'UNKNOWN_ERROR';
    const message = errorPayload?.error?.message || `HTTP ${response.status} Error`;
    const details = errorPayload?.error?.details;

    // 401 Interceptor: clear token & redirect to /login unless it's the login endpoint itself
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('popqueue_token');
      localStorage.removeItem('popqueue_user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        try {
          window.location.href = '/login';
        } catch {
          // jsdom navigation handling
        }
      }
    }

    // 403 Interceptor: for FORBIDDEN_ROLE redirect to /forbidden
    if (response.status === 403 && code === 'FORBIDDEN_ROLE') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/forbidden') {
        try {
          window.location.href = '/forbidden';
        } catch {
          // jsdom navigation handling
        }
      }
    }

    throw new ApiError(response.status, code, message, details);
  }

  return (await response.json()) as T;
}
