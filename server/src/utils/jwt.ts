import { JwtPayload } from '../types/auth.js';
import { Role } from '@prisma/client';

/**
 * Stub implementation for TDD Red Phase.
 * Returns dummy values so tests import cleanly but fail on assertions.
 */
export function signJwt(_payload: { sub: string; role: Role; tokenVersion: number }): string {
  return 'dummy-stub-token';
}

export function verifyJwt(_token: string): JwtPayload {
  return {
    sub: 'dummy-stub-user-id',
    role: 'COLLECTOR',
    tokenVersion: 0,
  };
}
