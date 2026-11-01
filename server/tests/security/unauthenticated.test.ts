import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { Role } from '@prisma/client';
import { app } from '../../src/app.js';
import { protectedRoutes } from '../helpers/protected-routes.js';
import {
  signExpiredTestToken,
  signAlgorithmNoneToken,
  signAlgorithmConfusionToken,
  getAuthHeader,
} from '../helpers/auth-helper.js';

describe('Security: Unauthenticated & Malformed Token Protection (TEST-04, AC-04, NFR-02)', () => {
  const dummyPayload = {
    sub: '00000000-0000-0000-0000-000000000000',
    role: Role.COLLECTOR,
    tokenVersion: 0,
  };

  protectedRoutes.forEach((route) => {
    describe(`${route.method} ${route.path} (${route.description})`, () => {
      const executeRequest = (authHeader?: string) => {
        let req = request(app)[route.method.toLowerCase() as 'get' | 'post'](route.path);
        if (authHeader) {
          req = req.set('Authorization', authHeader);
        }
        if (route.body) {
          req = req.send(route.body);
        }
        return req;
      };

      it('rejects request with missing Authorization header (401 UNAUTHENTICATED)', async () => {
        const res = await executeRequest();

        expect(res.status).toBe(401);
        expect(res.body.error).toEqual({
          code: 'UNAUTHENTICATED',
          message: expect.stringMatching(/authentication required|unauthenticated/i),
          statusCode: 401,
        });
        expect(res.body.data).toBeUndefined();
      });

      it('rejects request with malformed Bearer token header (401 UNAUTHENTICATED)', async () => {
        const res = await executeRequest('Bearer garbage-invalid-token-string');

        expect(res.status).toBe(401);
        expect(res.body.error).toEqual({
          code: 'UNAUTHENTICATED',
          message: expect.stringMatching(/authentication required|unauthenticated/i),
          statusCode: 401,
        });
        expect(res.body.data).toBeUndefined();
      });

      it('rejects request with tampered JWT payload/signature (401 UNAUTHENTICATED)', async () => {
        // Valid structure but forged/tampered signature
        const tamperedToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJyb2xlIjoiQk9YX01BU1RFUiJ9.invalidSignatureHash123456789';
        const res = await executeRequest(`Bearer ${tamperedToken}`);

        expect(res.status).toBe(401);
        expect(res.body.error).toEqual({
          code: 'UNAUTHENTICATED',
          message: expect.stringMatching(/authentication required|unauthenticated/i),
          statusCode: 401,
        });
        expect(res.body.data).toBeUndefined();
      });

      it('rejects request with expired JWT token (401 UNAUTHENTICATED)', async () => {
        const expiredToken = signExpiredTestToken(dummyPayload);
        const res = await executeRequest(getAuthHeader(expiredToken).Authorization);

        expect(res.status).toBe(401);
        expect(res.body.error).toEqual({
          code: 'UNAUTHENTICATED',
          message: expect.stringMatching(/authentication required|unauthenticated/i),
          statusCode: 401,
        });
        expect(res.body.data).toBeUndefined();
      });

      it('rejects request with alg: none algorithm token (401 UNAUTHENTICATED)', async () => {
        const noneToken = signAlgorithmNoneToken(dummyPayload);
        const res = await executeRequest(getAuthHeader(noneToken).Authorization);

        expect(res.status).toBe(401);
        expect(res.body.error).toEqual({
          code: 'UNAUTHENTICATED',
          message: expect.stringMatching(/authentication required|unauthenticated/i),
          statusCode: 401,
        });
        expect(res.body.data).toBeUndefined();
      });

      it('rejects request with unsupported algorithm (e.g. HS512) (401 UNAUTHENTICATED)', async () => {
        const hs512Token = signAlgorithmConfusionToken(dummyPayload);
        const res = await executeRequest(getAuthHeader(hs512Token).Authorization);

        expect(res.status).toBe(401);
        expect(res.body.error).toEqual({
          code: 'UNAUTHENTICATED',
          message: expect.stringMatching(/authentication required|unauthenticated/i),
          statusCode: 401,
        });
        expect(res.body.data).toBeUndefined();
      });
    });
  });
});
