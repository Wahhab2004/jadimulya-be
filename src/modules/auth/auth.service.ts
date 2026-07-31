import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../../common/ApiError';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { LoginInput } from './auth.schema';

function signTokens(adminId: string, role: string) {
  const payload = { sub: adminId, role };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'],
  });
  return { accessToken, refreshToken };
}

// FR-ADM-01: Login Admin — kredensial salah ditolak dengan pesan aman
// (tidak membocorkan apakah email atau password yang salah).
export async function login(input: LoginInput) {
  const admin = await prisma.adminUser.findUnique({ where: { email: input.email } });

  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized('Email atau password salah');
  }

  const isPasswordValid = await bcrypt.compare(input.password, admin.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Email atau password salah');
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = signTokens(admin.id, admin.role);

  return {
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    ...tokens,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      sub: string;
      role: string;
    };
    const accessToken = jwt.sign({ sub: payload.sub, role: payload.role }, env.JWT_ACCESS_SECRET as string, {
      expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
    });
    return { accessToken };
  } catch {
    throw ApiError.unauthorized('Refresh token tidak valid atau kedaluwarsa');
  }
}
