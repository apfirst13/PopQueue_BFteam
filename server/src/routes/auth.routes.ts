import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export const authRouter = Router();

// Public login endpoint
authRouter.post('/login', authController.login.bind(authController));

// Protected authenticated endpoints
authRouter.post('/logout', authenticateToken, authController.logout.bind(authController));
authRouter.get('/me', authenticateToken, authController.getMe.bind(authController));
