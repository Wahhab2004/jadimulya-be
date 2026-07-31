import { AdminRole } from '@prisma/client';
import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];

// BARU — endpoint create admin (POST /auth/admins), cuma bisa diakses admin
// yang sudah login (lihat requireAuth di auth.routes.ts).
//
// role divalidasi langsung dari enum AdminRole di schema.prisma (SUPER_ADMIN
// | ADMIN) — request dengan role di luar itu otomatis ditolak di sini,
// sebelum sempat nyampe ke database.
export const createAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    role: z.nativeEnum(AdminRole).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>['body'];