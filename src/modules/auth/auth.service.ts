import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminRole } from '@prisma/client';
import { ApiError } from '../../common/ApiError';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { CreateAdminInput, LoginInput } from './auth.schema';

const PASSWORD_SALT_ROUNDS = 10;
const DEFAULT_ADMIN_ROLE = AdminRole.ADMIN;

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

// BARU — create admin baru. Cuma dipanggil lewat endpoint yang sudah
// diproteksi requireAuth (lihat auth.routes.ts), jadi di titik ini request
// dianggap datang dari admin yang sudah login — bukan endpoint publik.
//
// Catatan keamanan: ini SENGAJA tidak mengembalikan accessToken/refreshToken
// untuk admin yang baru dibuat (beda dengan login()) — admin baru tetap
// harus login sendiri lewat /auth/login memakai password yang diberikan.
export async function createAdmin(input: CreateAdminInput, requesterRole?: AdminRole) {
  const existing = await prisma.adminUser.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict('Email sudah terdaftar sebagai admin');
  }

  const requestedRole = input.role ?? DEFAULT_ADMIN_ROLE;

  // Cegah privilege escalation: admin biasa (ADMIN) tidak boleh membuat akun
  // SUPER_ADMIN — cuma SUPER_ADMIN yang boleh. Komentar di schema.prisma
  // bilang MVP ini baru benar-benar pakai 1 role (ADMIN) dan SUPER_ADMIN
  // disiapkan untuk nanti, jadi guard ini murah untuk dipasang dari awal
  // supaya nggak jadi lubang keamanan begitu tier itu mulai dipakai serius.
  if (requestedRole === AdminRole.SUPER_ADMIN && requesterRole !== AdminRole.SUPER_ADMIN) {
    // NOTE: pakai ApiError.forbidden() di sini — file common/ApiError.ts belum
    // pernah dikirim, jadi saya asumsikan method ini ada (mengikuti pola
    // ApiError.notFound/badRequest/unauthorized/conflict yang sudah dipakai
    // di modul lain). Kalau ApiError Anda belum punya static method
    // `forbidden` (HTTP 403), tinggal tambahkan di common/ApiError.ts, atau
    // sementara ganti baris ini ke ApiError.unauthorized(...).
    throw ApiError.forbidden('Hanya SUPER_ADMIN yang boleh membuat akun SUPER_ADMIN');
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

  const admin = await prisma.adminUser.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: requestedRole,
      isActive: true,
    },
  });

  return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
}