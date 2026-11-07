import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config } from '../../src/config/env.js';

export interface TestJwtPayload {
  sub: string;
  role: Role;
  tokenVersion: number;
}

export const SEED_COLLECTOR_PASSWORD =
  process.env.SEED_COLLECTOR_PASSWORD || 'collector_dev_password123';
export const SEED_STAFF_PASSWORD =
  process.env.SEED_STAFF_PASSWORD || 'staff_dev_password123';

/**
 * Signs a test JWT with HS256 algorithm.
 * Supports both object payload and positional arguments:
 * - signTestToken(payload, expiresIn?)
 * - signTestToken(sub, role, tokenVersion, expiresIn?)
 */
export function signTestToken(
  subOrPayload: string | TestJwtPayload,
  roleOrExpiresIn?: Role | string,
  tokenVersion?: number,
  expiresIn?: string,
): string {
  let payload: TestJwtPayload;
  let exp = '8h';

  if (typeof subOrPayload === 'string') {
    payload = {
      sub: subOrPayload,
      role: (roleOrExpiresIn as Role) || Role.COLLECTOR,
      tokenVersion: tokenVersion ?? 0,
    };
    exp = expiresIn || '8h';
  } else {
    payload = subOrPayload;
    exp = (roleOrExpiresIn as string) || '8h';
  }

  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: exp as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

export function getAuthHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

export function signExpiredTestToken(payload: TestJwtPayload): string {
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '-10s' as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

export function signAlgorithmNoneToken(payload: TestJwtPayload): string {
  // Construct an unsecured JWT (alg: "none") manually without secret
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
  return `${header}.${body}.`;
}

export function signAlgorithmConfusionToken(payload: TestJwtPayload): string {
  const options: SignOptions = {
    algorithm: 'HS512',
    expiresIn: '8h' as SignOptions['expiresIn'],
  };
  // Sign using HS512 instead of HS256
  return jwt.sign(payload, config.JWT_SECRET, options);
}
