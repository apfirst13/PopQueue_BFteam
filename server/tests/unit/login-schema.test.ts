import { describe, it, expect } from 'vitest';
import { loginSchema } from '../../src/types/auth.js';

describe('Login Schema Validation Unit (TEST-03U, AC-03, Issue #47)', () => {
  it('rejects payload missing required password field', () => {
    const result = loginSchema.safeParse({ username: 'collector1' });
    expect(result.success).toBe(false);
  });

  it('rejects payload with empty string password', () => {
    const result = loginSchema.safeParse({ username: 'collector1', password: '' });
    expect(result.success).toBe(false);
  });

  it('accepts payload with non-empty username and password strings', () => {
    const result = loginSchema.safeParse({ username: 'collector1', password: 'secret' });
    expect(result.success).toBe(true);
  });
});
