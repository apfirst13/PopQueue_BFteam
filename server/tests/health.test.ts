import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Health and Readiness Endpoints (Lab 5, R-03 & R-08)', () => {
  it('GET /api/v1/health returns status ok and commit SHA with 200 status code', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      commit: process.env.GIT_SHA || 'dev',
    });
  });

  it('GET /api/health returns status ok and commit SHA with 200 status code', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      commit: process.env.GIT_SHA || 'dev',
    });
  });

  it('GET /api/health reflects injected GIT_SHA environment variable', async () => {
    const originalSha = process.env.GIT_SHA;
    process.env.GIT_SHA = '65f828c1234567890abcdef1234567890abcdef';
    try {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        commit: '65f828c1234567890abcdef1234567890abcdef',
      });
    } finally {
      if (originalSha === undefined) {
        delete process.env.GIT_SHA;
      } else {
        process.env.GIT_SHA = originalSha;
      }
    }
  });

  it('GET /api/ready returns db connected when DB is reachable', async () => {
    const response = await request(app).get('/api/ready');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ db: 'connected' });
  });
});
