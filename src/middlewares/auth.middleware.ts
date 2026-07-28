import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../common/ApiError';
import { env } from '../config/env';

export interface AuthPayload {
  sub: string; // admin user id
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

// Melindungi route admin. Token dikirim lewat header:
// Authorization: Bearer <access_token>
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Token akses tidak ditemukan');
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
    req.admin = payload;
    next();
  } catch {
    throw ApiError.unauthorized('Token akses tidak valid atau kedaluwarsa');
  }
}

// Contoh guard tambahan untuk Future (multi-role permission).
// Belum dipakai di MVP karena hanya ada satu role aktif (ADMIN).
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      throw ApiError.forbidden('Anda tidak memiliki akses untuk aksi ini');
    }
    next();
  };
}
