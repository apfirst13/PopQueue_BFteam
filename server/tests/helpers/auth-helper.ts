import jwt from 'jsonwebtoken';
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

export function signTestToken(
  payload: TestJwtPayload,
  expiresIn: string = '8h',
): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn,
  });
}

export function signExpiredTestToken(payload: TestJwtPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '-10s',
  });
}

export function signAlgorithmNoneToken(payload: TestJwtPayload): string {
  // Construct an unsecured JWT (alg: "none") manually without secret
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
  return `${header}.${body}.`;
}

export function signAlgorithmConfusionToken(payload: TestJwtPayload): string {
  // Sign using HS512 instead of HS256
  return jwt.sign(payload, config.JWT_SECRET, {
    algorithm: 'HS512',
    expiresIn: '8h',
  });
}

export function getAuthHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
