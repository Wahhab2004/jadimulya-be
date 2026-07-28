import 'dotenv/config';
import { z } from 'zod';

// Validasi environment variables saat startup — gagal cepat kalau ada yang
// hilang, daripada error samar di tengah runtime.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL wajib diisi'),
  JWT_ACCESS_SECRET: z.string().min(10, 'JWT_ACCESS_SECRET terlalu pendek'),
  JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH_SECRET terlalu pendek'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(200),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Konfigurasi environment tidak valid:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
