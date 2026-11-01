import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config } from '../config/env.js';
import { JwtPayload } from '../types/auth.js';
import { AppError } from '../middleware/error-handler.js';

/**
 * Signs a JWT with standard PopQueue claims (HS256) and configured expiration (default 8h).
 */
export function signJwt(payload: { sub: string; role: Role; tokenVersion: number }): string {
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.JWT_SECRET, options);
}

/**
 * Strictly verifies a JWT using HS256 algorithm only (protects against Algorithm Confusion / None attacks).
 */
export function verifyJwt(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JwtPayload;

    return decoded;
  } catch (_error) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
  }
}
