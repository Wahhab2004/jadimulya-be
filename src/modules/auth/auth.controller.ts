import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { sendSuccess } from '../../common/ApiResponse';
import { ApiError } from '../../common/ApiError';
import * as authService from './auth.service';

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
