import { Request, Response, NextFunction } from 'express';
import { loginSchema } from '../types/auth.js';
import { authService } from '../services/auth.service.js';
import { AppError } from '../middleware/error-handler.js';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parseResult = loginSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Invalid login payload');
      }

      const { username, password } = parseResult.data;
      const result = await authService.login(username, password);

      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const result = await authService.logout(req.user.id);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required or token has been revoked');
      }

      const result = await authService.getMe(req.user.id);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
