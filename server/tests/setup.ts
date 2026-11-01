// Test environment setup
process.env.NODE_ENV = 'test';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = 'test-jwt-secret-key-at-least-32-chars-long';
}
