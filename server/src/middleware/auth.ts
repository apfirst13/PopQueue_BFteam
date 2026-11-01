import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyJwt } from '../utils/jwt.js';
import { prisma } from '../config/db.js';
import { AppError } from './error-handler.js';

/**
 * Authentication Middleware (AC-04, NFR-02)
 * Validates Bearer token, signature, expiration, and checks tokenVersion against PostgreSQL.
 */
export async function authenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        401,
        'UNAUTHENTICATED',
        'Authentication required or token has been revoked',
      );
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      throw new AppError(
        401,
        'UNAUTHENTICATED',
        'Authentication required or token has been revoked',
      );
    }

    const payload = verifyJwt(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new AppError(
        401,
        'UNAUTHENTICATED',
        'Authentication required or token has been revoked',
      );
    }

    req.user = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Role-Based Access Control Middleware Guard (AC-08, BR-04)
 * Enforces Role check strictly after Authentication check (Part C §6).
 */
export function requireRole(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // 1. Authentication check precedes Role check
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required or token has been revoked',
          statusCode: 401,
        },
      });
      return;
    }

    // 2. Role permission check
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN_ROLE',
          message: 'Forbidden: Insufficient role permissions',
          statusCode: 403,
        },
      });
      return;
    }

    next();
  };
}
