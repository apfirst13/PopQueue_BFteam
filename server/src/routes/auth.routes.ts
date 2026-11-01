import { Router } from 'express';

/**
 * Stub Router for TDD Red Phase.
 * Empty router will yield 404 on unmapped endpoints, causing assertions expecting 200/400/401 to fail.
 */
export const authRouter = Router();
