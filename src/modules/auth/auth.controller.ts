import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { sendCreated, sendSuccess } from '../../common/ApiResponse';
import { ApiError } from '../../common/ApiError';
import * as authService from './auth.service';
import { AdminRole } from '@prisma/client';

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendSuccess(res, result, 'Login berhasil');
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    throw ApiError.badRequest('refreshToken wajib diisi');
  }
  const result = await authService.refreshAccessToken(refreshToken);
  sendSuccess(res, result, 'Token diperbarui');
});

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  // req.admin diisi oleh requireAuth middleware
  sendSuccess(res, req.admin, 'OK');
});

// BARU — hanya boleh dipanggil admin yang sudah login (lihat requireAuth
// di auth.routes.ts pada route POST /auth/admins).
export const createAdminHandler = asyncHandler(async (req: Request, res: Response) => {
  // NOTE: bentuk persis req.admin ditentukan requireAuth middleware (belum
  // pernah dikirim ke saya) — saya asumsikan minimal punya `role` sesuai
  // payload JWT di signTokens() (auth.service.ts: { sub, role }). Kalau
  // bentuknya beda, sesuaikan baris ini.
  
  const result = await authService.createAdmin(req.body, req.admin?.role as AdminRole | undefined);
  sendCreated(res, result, 'Admin baru berhasil dibuat');
});
