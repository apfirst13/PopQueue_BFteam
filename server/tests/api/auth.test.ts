import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';
import { app } from '../../src/app.js';
import { config } from '../../src/config/env.js';
import {
  SEED_COLLECTOR_PASSWORD,
  SEED_STAFF_PASSWORD,
  getAuthHeader,
} from '../helpers/auth-helper.js';

const prisma = new PrismaClient();

describe('Authentication & Role Identity API (F-01, AC-01..AC-06)', () => {
  beforeAll(async () => {
    // Ensure database connection
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/login', () => {
    it('TEST-01 (AC-01): logs in successfully with valid credentials for Collector and Box Master', async () => {
      // 1. Collector login
      const collectorRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'collector1',
          password: SEED_COLLECTOR_PASSWORD,
        });

      expect(collectorRes.status).toBe(200);
      expect(collectorRes.body.data).toBeDefined();
      expect(collectorRes.body.data.token).toBeDefined();
      expect(collectorRes.body.data.user).toEqual({
        id: expect.any(String),
        username: 'collector1',
        fullName: 'Collector 1',
        role: Role.COLLECTOR,
      });

      // Verify decoded JWT sub and role
      const decodedCollector = jwt.verify(
        collectorRes.body.data.token,
        config.JWT_SECRET,
      ) as jwt.JwtPayload;
      expect(decodedCollector.sub).toBe(collectorRes.body.data.user.id);
      expect(decodedCollector.role).toBe(Role.COLLECTOR);

      // 2. Box Master login
      const staffRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'staff_crybaby',
          password: SEED_STAFF_PASSWORD,
        });

      expect(staffRes.status).toBe(200);
      expect(staffRes.body.data.token).toBeDefined();
      expect(staffRes.body.data.user.role).toBe(Role.BOX_MASTER);
      expect(staffRes.body.data.user.username).toBe('staff_crybaby');
    });

    it('TEST-02 (AC-02): returns identical 401 INVALID_CREDENTIALS for wrong password or unknown user', async () => {
      // (a) Existing user + wrong password
      const wrongPassRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'collector1',
          password: 'definitely-the-wrong-password',
        });

      expect(wrongPassRes.status).toBe(401);
      expect(wrongPassRes.body.data).toBeUndefined();
      expect(wrongPassRes.body.error).toEqual({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password',
        statusCode: 401,
      });

      // (b) Non-existent user
      const unknownUserRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nobody_in_the_system',
          password: 'some-password',
        });

      expect(unknownUserRes.status).toBe(401);
      expect(unknownUserRes.body.data).toBeUndefined();
      expect(unknownUserRes.body.error).toEqual({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password',
        statusCode: 401,
      });

      // Responses must be completely identical (prevent username enumeration)
      expect(wrongPassRes.body).toEqual(unknownUserRes.body);
    });

    it('TEST-03 (AC-03): returns 400 VALIDATION_ERROR on missing, empty, or malformed JSON payloads', async () => {
      // Empty object
      const emptyRes = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(emptyRes.status).toBe(400);
      expect(emptyRes.body.error.code).toBe('VALIDATION_ERROR');
      expect(emptyRes.body.error.statusCode).toBe(400);

      // Empty string username
      const emptyUserRes = await request(app)
        .post('/api/auth/login')
        .send({ username: '', password: 'some-password' });
      expect(emptyUserRes.status).toBe(400);
      expect(emptyUserRes.body.error.code).toBe('VALIDATION_ERROR');

      // Missing password
      const missingPassRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'collector1' });
      expect(missingPassRes.status).toBe(400);
      expect(missingPassRes.body.error.code).toBe('VALIDATION_ERROR');

      // Malformed JSON string
      const malformedRes = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"username": "collector1", "password": ');
      expect(malformedRes.status).toBe(400);
      expect(malformedRes.body.error.code).toBe('VALIDATION_ERROR');
      expect(malformedRes.body.error.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('TEST-05 (AC-05): revokes token via tokenVersion increment across devices', async () => {
      // Use collector6 exclusively to avoid concurrent race conditions with other tests
      const userBefore = await prisma.user.findUniqueOrThrow({
        where: { username: 'collector6' },
      });
      const initialVersion = userBefore.tokenVersion;

      // 1. Login to obtain Token A
      const loginResA = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'collector6',
          password: SEED_COLLECTOR_PASSWORD,
        });
      expect(loginResA.status).toBe(200);
      const tokenA = loginResA.body.data.token;

      // Verify Token A can access /me
      const meResA = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeader(tokenA));
      expect(meResA.status).toBe(200);

      // 2. Logout using Token A
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set(getAuthHeader(tokenA));
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.data).toEqual({ success: true });

      // Verify tokenVersion incremented in DB
      const userAfter = await prisma.user.findUniqueOrThrow({
        where: { username: 'collector6' },
      });
      expect(userAfter.tokenVersion).toBe(initialVersion + 1);

      // 3. Token A must now be rejected with 401 UNAUTHENTICATED
      const meResRevoked = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeader(tokenA));
      expect(meResRevoked.status).toBe(401);
      expect(meResRevoked.body.error.code).toBe('UNAUTHENTICATED');

      // 4. Log in again to get Token B
      const loginResB = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'collector6',
          password: SEED_COLLECTOR_PASSWORD,
        });
      expect(loginResB.status).toBe(200);
      const tokenB = loginResB.body.data.token;

      // Token B must work
      const meResB = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeader(tokenB));
      expect(meResB.status).toBe(200);
      expect(meResB.body.data.username).toBe('collector6');
    });
  });

  describe('GET /api/auth/me', () => {
    it('TEST-06 (AC-06): returns user profile and assignedSeries for Box Masters and empty array for Collector', async () => {
      // 1. staff_crybaby -> assignedSeries = [CRY]
      const loginCrybaby = await request(app)
        .post('/api/auth/login')
        .send({ username: 'staff_crybaby', password: SEED_STAFF_PASSWORD });
      const meCrybaby = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeader(loginCrybaby.body.data.token));

      expect(meCrybaby.status).toBe(200);
      expect(meCrybaby.body.data).toEqual({
        id: expect.any(String),
        username: 'staff_crybaby',
        fullName: 'Staff Crybaby',
        role: Role.BOX_MASTER,
        assignedSeries: [
          {
            id: expect.any(String),
            code: 'CRY',
            name: 'Crybaby Sunset Concert',
          },
        ],
      });

      // 2. staff_labubu -> assignedSeries = [LAB]
      const loginLabubu = await request(app)
        .post('/api/auth/login')
        .send({ username: 'staff_labubu', password: SEED_STAFF_PASSWORD });
      const meLabubu = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeader(loginLabubu.body.data.token));

      expect(meLabubu.status).toBe(200);
      expect(meLabubu.body.data.assignedSeries).toEqual([
        {
          id: expect.any(String),
          code: 'LAB',
          name: 'Labubu Macaron',
        },
      ]);

      // 3. collector1 -> assignedSeries = []
      const loginCollector = await request(app)
        .post('/api/auth/login')
        .send({ username: 'collector1', password: SEED_COLLECTOR_PASSWORD });
      const meCollector = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeader(loginCollector.body.data.token));

      expect(meCollector.status).toBe(200);
      expect(meCollector.body.data.assignedSeries).toEqual([]);
    });
  });
});
