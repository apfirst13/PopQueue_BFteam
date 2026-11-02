import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { prisma } from '../../src/config/db.js';
import { app } from '../../src/app.js';
import { signTestToken, getAuthHeader } from '../helpers/auth-helper.js';
import { resetQueueState, createTicketFixture } from '../helpers/queue-helper.js';
import { Role, TicketStatus } from '@prisma/client';

describe('F-04 Ticket Security & Ownership: GET /api/tickets/:id (TEST-37, TEST-38)', () => {
  let collector1Token: string;
  let collector2Token: string;
  let staffCryToken: string;
  let staffLabToken: string;

  let collector1User: { id: string; fullName: string };
  let crySeries: { id: string; code: string; name: string };

  beforeAll(async () => {
    const c1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const c2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const staffCry = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const staffLab = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_labubu' } });
    const series = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    collector1User = c1;
    crySeries = series;

    collector1Token = signTestToken(c1.id, Role.COLLECTOR, c1.tokenVersion);
    collector2Token = signTestToken(c2.id, Role.COLLECTOR, c2.tokenVersion);
    staffCryToken = signTestToken(staffCry.id, Role.BOX_MASTER, staffCry.tokenVersion);
    staffLabToken = signTestToken(staffLab.id, Role.BOX_MASTER, staffLab.tokenVersion);
  });

  beforeEach(async () => {
    await resetQueueState();
  });

  describe('TEST-37: Ownership Security & Zero Information Leakage (AC-37, FR-06, BR-04, NFR-02)', () => {
    it('rejects foreign collector with 403 FORBIDDEN_OWNERSHIP without leaking metadata', async () => {
      const ticket = await createTicketFixture({
        userId: collector1User.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.WAITING,
      });

      // collector2 attempts to inspect collector1's ticket
      const res = await request(app)
        .get(`/api/tickets/${ticket.id}`)
        .set(getAuthHeader(collector2Token));

      expect(res.status).toBe(403);

      // Strict body verification: exactly one key "error"
      expect(Object.keys(res.body)).toEqual(['error']);

      // Error object keys must strictly be code, message, statusCode
      expect(Object.keys(res.body.error).sort()).toEqual(['code', 'message', 'statusCode'].sort());

      expect(res.body.error).toEqual({
        code: 'FORBIDDEN_OWNERSHIP',
        message: expect.stringMatching(/permission|forbidden|ownership/i),
        statusCode: 403,
      });

      // Must never leak ticket data or metadata in body
      const rawBody = JSON.stringify(res.body);
      expect(rawBody).not.toContain('CRY-001');
      expect(rawBody).not.toContain(collector1User.fullName);
      expect(rawBody).not.toContain('WAITING');
      expect(rawBody).not.toContain(crySeries.id);
    });
  });

  describe('TEST-38: Scope Boundaries and Evaluation Order (AC-38, FR-06, BR-04)', () => {
    it('(a) allows assigned Box Master (CRY) to inspect ticket with userFullName', async () => {
      const ticket = await createTicketFixture({
        userId: collector1User.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.WAITING,
      });

      const res = await request(app)
        .get(`/api/tickets/${ticket.id}`)
        .set(getAuthHeader(staffCryToken));

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data).toMatchObject({
        id: ticket.id,
        displayNumber: 'CRY-001',
        status: 'WAITING',
        series: {
          id: crySeries.id,
          code: 'CRY',
          name: crySeries.name,
        },
        userFullName: collector1User.fullName,
      });
    });

    it('(b) rejects cross-series Box Master (LAB) with 403 FORBIDDEN_SERIES', async () => {
      const ticket = await createTicketFixture({
        userId: collector1User.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.WAITING,
      });

      const res = await request(app)
        .get(`/api/tickets/${ticket.id}`)
        .set(getAuthHeader(staffLabToken));

      expect(res.status).toBe(403);
      expect(res.body.data).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'FORBIDDEN_SERIES',
        message: expect.stringMatching(/series|assignment|forbidden/i),
        statusCode: 403,
      });
    });

    it('(c) returns 404 RESOURCE_NOT_FOUND when ticket does not exist (non-existent UUID)', async () => {
      const nonExistentUuid = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .get(`/api/tickets/${nonExistentUuid}`)
        .set(getAuthHeader(collector1Token));

      expect(res.status).toBe(404);
      expect(res.body.data).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'RESOURCE_NOT_FOUND',
        message: expect.stringMatching(/not found/i),
        statusCode: 404,
      });
    });

    it('(d) returns 400 VALIDATION_ERROR when :id is not a valid UUID format', async () => {
      const res = await request(app)
        .get('/api/tickets/abc')
        .set(getAuthHeader(collector1Token));

      expect(res.status).toBe(400);
      expect(res.body.data).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'VALIDATION_ERROR',
        message: expect.stringMatching(/uuid/i),
        statusCode: 400,
      });
    });
  });
});
