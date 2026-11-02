export interface ProtectedRouteDef {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  body?: unknown;
  addedInIssue: 'I-02' | 'I-03' | 'I-04' | 'I-05' | 'I-06';
}

/**
 * Centralized registry of all protected routes requiring authentication (NFR-02, AC-04)
 * Sequentially extended by issues I-02 through I-06.
 */
export const protectedRoutes: ProtectedRouteDef[] = [
  { method: 'POST', path: '/api/auth/logout', description: 'Logout endpoint', addedInIssue: 'I-02' },
  { method: 'GET', path: '/api/auth/me', description: 'Get current user profile', addedInIssue: 'I-02' },
  {
    method: 'POST',
    path: '/api/tickets/join',
    description: 'Join queue for a series',
    body: { seriesId: '00000000-0000-0000-0000-000000000000' },
    addedInIssue: 'I-03',
  },
  {
    method: 'GET',
    path: '/api/tickets/my-ticket',
    description: 'Get collector active queue ticket',
    addedInIssue: 'I-04',
  },
  {
    method: 'GET',
    path: '/api/tickets/00000000-0000-0000-0000-000000000000',
    description: 'Get ticket details by ID',
    addedInIssue: 'I-04',
  },
];
