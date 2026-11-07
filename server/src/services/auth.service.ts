import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../config/db.js';
import { signJwt } from '../utils/jwt.js';
import { AppError } from '../middleware/error-handler.js';

export interface LoginResult {
  token: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    role: Role;
  };
}

export interface MeResult {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  assignedSeries: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

export class AuthService {
  /**
   * Authenticates user credentials with Bcrypt and generates an 8-hour JWT (AC-01, AC-02, NFR-01).
   */
  async login(username: string, password: string): Promise<LoginResult> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      // Use generic error message to prevent username enumeration (AC-02)
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
    }

    const token = signJwt({
      sub: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  /**
   * Revokes all active tokens for the user by incrementing tokenVersion (AC-05, D-04, D-11).
   */
  async logout(userId: string): Promise<{ success: boolean }> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });

    return { success: true };
  }

  /**
   * Retrieves profile and assigned series for current user (AC-06, FR-02).
   */
  async getMe(userId: string): Promise<MeResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assignments: {
          include: {
            series: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
    }

    const assignedSeries =
      user.role === Role.BOX_MASTER
        ? user.assignments.map((assignment) => ({
            id: assignment.series.id,
            code: assignment.series.code,
            name: assignment.series.name,
          }))
        : [];

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      assignedSeries,
    };
  }
}

export const authService = new AuthService();
