import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler } from '../src/middleware/error-handler.js';

describe('Centralized Error Handler (NFR-05)', () => {
  it('formats AppError correctly without leaking stack trace', async () => {
    const testApp = express();
    testApp.get('/test-error', () => {
      throw new AppError(400, 'BAD_REQUEST', 'Invalid input data', { field: 'name' });
    });
    testApp.use(errorHandler);

    const response = await request(testApp).get('/test-error');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid input data',
        statusCode: 400,
        details: { field: 'name' },
      },
    });
    expect(response.body.stack).toBeUndefined();
    expect(response.body.error.stack).toBeUndefined();
  });

  it('masks unhandled errors with 500 INTERNAL_ERROR and never leaks stack trace', async () => {
    const testApp = express();
    testApp.get('/crash', (_req: Request, _res: Response, _next: NextFunction) => {
      throw new Error('Database connection string leaked credentials secret');
    });
    testApp.use(errorHandler);

    const response = await request(testApp).get('/crash');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected internal error occurred',
        statusCode: 500,
      },
    });
    expect(response.body.stack).toBeUndefined();
    expect(response.body.error.stack).toBeUndefined();
    expect(JSON.stringify(response.body)).not.toContain('Database connection string');
  });
});
