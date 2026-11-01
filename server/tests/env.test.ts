import { describe, it, expect } from 'vitest';
import { loadConfig } from '../src/config/env.js';

describe('Environment Configuration & Validation (NFR-01, Part C §9)', () => {
  const validBaseEnv = {
    DATABASE_URL: 'postgresql://popqueue:popqueue_dev_password@localhost:5432/popqueue_test',
    JWT_SECRET: 'a-very-long-secret-key-that-has-at-least-32-chars!',
  };

  it('fails fast when JWT_SECRET is missing (no fallback allowed)', () => {
    const invalidEnv = {
      DATABASE_URL: validBaseEnv.DATABASE_URL,
    };

    expect(() => loadConfig(invalidEnv)).toThrow(/JWT_SECRET/i);
  });

  it('fails fast when JWT_SECRET is shorter than 32 characters', () => {
    const shortSecretEnv = {
      DATABASE_URL: validBaseEnv.DATABASE_URL,
      JWT_SECRET: 'only-20-chars-secret', // 20 chars < 32
    };

    expect(() => loadConfig(shortSecretEnv)).toThrow(/at least 32 characters/i);
  });

  it('defaults PORT to 4000 as required by Master Spec Part C §9', () => {
    const config = loadConfig(validBaseEnv);
    expect(config.PORT).toBe(4000);
  });

  it('loads valid configuration successfully', () => {
    const config = loadConfig(validBaseEnv);
    expect(config.JWT_SECRET).toBe(validBaseEnv.JWT_SECRET);
    expect(config.TZ).toBe('Asia/Bangkok');
    expect(config.BCRYPT_COST).toBe(10);
  });
});
