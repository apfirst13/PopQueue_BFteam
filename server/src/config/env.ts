import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  TZ: z.string().default('Asia/Bangkok'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type Config = z.infer<typeof envSchema>;

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`Configuration validation failed: ${issues}`);
  }
  return result.data;
}

// Lazy/cached configuration for application runtime
const activeEnv = process.env.NODE_ENV === 'test' ? {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://popqueue:popqueue_dev_password@localhost:5432/popqueue_test',
  JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret-key-32-chars-long-test-env',
} : process.env;

export const config = loadConfig(activeEnv);
