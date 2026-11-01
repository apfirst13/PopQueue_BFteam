import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

/**
 * Stub middleware for TDD Red Phase.
 * Implements pass-through behavior so that tests fail specifically on assertions.
 */
export async function authenticateToken(
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  // Faulty pass-through: does not verify token or attach req.user
  next();
}

export function requireRole(_allowedRoles: Role[]) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    // Faulty pass-through: lets everyone through
    next();
  };
}
