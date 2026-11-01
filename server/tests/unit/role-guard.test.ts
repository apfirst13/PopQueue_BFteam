import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { requireRole } from '../../src/middleware/auth.js';

describe('Role Guard Middleware (TEST-08U, AC-08, BR-04)', () => {
  it('allows access (calls next) when user has the permitted role BOX_MASTER', () => {
    const middleware = requireRole([Role.BOX_MASTER]);

    const req = {
      user: {
        id: 'user-staff-1',
        username: 'staff_crybaby',
        fullName: 'Staff Crybaby',
        role: Role.BOX_MASTER,
        tokenVersion: 0,
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('rejects access with 403 FORBIDDEN_ROLE when user has role COLLECTOR', () => {
    const middleware = requireRole([Role.BOX_MASTER]);

    const req = {
      user: {
        id: 'user-collector-1',
        username: 'collector1',
        fullName: 'Collector 1',
        role: Role.COLLECTOR,
        tokenVersion: 0,
      },
    } as unknown as Request;

    const jsonFn = vi.fn();
    const statusFn = vi.fn().mockReturnValue({ json: jsonFn });
    const res = {
      status: statusFn,
      json: jsonFn,
    } as unknown as Response;

    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(statusFn).toHaveBeenCalledWith(403);
    expect(jsonFn).toHaveBeenCalledWith({
      error: {
        code: 'FORBIDDEN_ROLE',
        message: expect.stringMatching(/forbidden|insufficient/i),
        statusCode: 403,
      },
    });
  });

  it('rejects with 401 UNAUTHENTICATED when req.user is missing (Part C §6 order)', () => {
    const middleware = requireRole([Role.BOX_MASTER]);

    const req = {
      user: undefined,
    } as unknown as Request;

    const jsonFn = vi.fn();
    const statusFn = vi.fn().mockReturnValue({ json: jsonFn });
    const res = {
      status: statusFn,
      json: jsonFn,
    } as unknown as Response;

    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(statusFn).toHaveBeenCalledWith(401);
    expect(jsonFn).toHaveBeenCalledWith({
      error: {
        code: 'UNAUTHENTICATED',
        message: expect.stringMatching(/authentication required|unauthenticated/i),
        statusCode: 401,
      },
    });
  });
});
