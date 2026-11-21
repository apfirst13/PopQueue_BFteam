import { z } from 'zod';
import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  role: Role;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  tokenVersion: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const loginSchema = z.object({
  username: z.string({ required_error: 'Username is required' }).min(1, 'Username cannot be empty'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password cannot be empty'),
});

export type LoginInput = z.infer<typeof loginSchema>;
