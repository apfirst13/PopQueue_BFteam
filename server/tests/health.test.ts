import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Health and Readiness Endpoints (Lab 5, R-03)', () => {
  it('GET /api/v1/health returns status ok with 200 status code', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.commit).toBeDefined();
  });

  it('GET /api/health returns status ok with 200 status code', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.commit).toBeDefined();
  });

  it('GET /api/ready returns db connected when DB is reachable', async () => {
    const response = await request(app).get('/api/ready');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ db: 'connected' });
  });
});
