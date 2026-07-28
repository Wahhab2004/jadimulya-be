import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Prisma Client sebagai singleton — mencegah terlalu banyak koneksi terbuka
// saat ts-node-dev melakukan hot-reload di development.
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (env.NODE_ENV !== 'production') {
  global.__prisma__ = prisma;
}
