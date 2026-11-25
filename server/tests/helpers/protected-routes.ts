export interface ProtectedRouteDef {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  body?: unknown;
  addedInIssue: 'I-02' | 'I-03' | 'I-04' | 'I-05' | 'I-06' | 'D2-I2' | 'D2-I3' | 'D2-I5';
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
  {
    method: 'GET',
    path: '/api/staff/tickets',
    description: 'Get assigned series queues for staff counter',
    addedInIssue: 'I-05',
  },
  {
    method: 'POST',
    path: '/api/staff/call-next',
    description: 'Call next waiting ticket in series',
    body: { seriesId: '00000000-0000-0000-0000-000000000000' },
    addedInIssue: 'I-05',
  },
  {
    method: 'POST',
    path: '/api/staff/tickets/00000000-0000-0000-0000-000000000000/start-unboxing',
    description: 'Start unboxing verification for called ticket',
    addedInIssue: 'I-06',
  },
  {
    method: 'POST',
    path: '/api/staff/tickets/00000000-0000-0000-0000-000000000000/complete',
    description: 'Complete unboxing service for ticket',
    addedInIssue: 'I-06',
  },
  {
    method: 'POST',
    path: '/api/tickets/00000000-0000-0000-0000-000000000000/cancel',
    description: 'Cancel collector waiting queue ticket (F-05)',
    addedInIssue: 'D2-I2',
  },
  {
    method: 'POST',
    path: '/api/staff/tickets/00000000-0000-0000-0000-000000000000/no-show',
    description: 'Mark called ticket as no-show after 120s timeout (F-06)',
    addedInIssue: 'D2-I3',
  },
  {
    method: 'PATCH',
    path: '/api/staff/series/00000000-0000-0000-0000-000000000000/status',
    description: 'Toggle assigned series availability status (F-09)',
    body: { isActive: false },
    addedInIssue: 'D2-I5',
  },
];
