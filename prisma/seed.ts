// prisma/seed.ts
//
// Dipakai untuk bootstrap admin PERTAMA di database yang masih kosong —
// dijalankan manual sekali (bukan via API, karena POST /auth/admins butuh
// sudah login, dan di database kosong belum ada siapa pun yang bisa login).
//
// Dijalankan pakai `tsx` (bukan `ts-node`) — lebih ringan & cepat, dan
// `tsx` ditaruh di `dependencies` (bukan devDependencies) supaya tetap ada
// di production image meski image di-build dengan `npm ci --omit=dev`.
//
// Cara pakai:
//   SEED_ADMIN_EMAIL=admin@jadimulya.desa.id \
//   SEED_ADMIN_PASSWORD='GantiDenganPasswordKuat123!' \
//   npx prisma db seed
//
// Aman dijalankan berkali-kali — kalau email sudah terdaftar, script cuma
// skip (tidak menimpa atau error).

import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PASSWORD_SALT_ROUNDS = 10;

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? 'Super Admin';

  if (!email || !password) {
    throw new Error(
      'SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD wajib diisi lewat environment variable saat menjalankan seed. ' +
        "Contoh: SEED_ADMIN_EMAIL=admin@jadimulya.desa.id SEED_ADMIN_PASSWORD='...' npx prisma db seed",
    );
  }

  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD minimal 8 karakter (sama seperti aturan di loginSchema).');
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin dengan email ${email} sudah ada — seed dilewati (aman, tidak menimpa apa pun).`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  // Admin pertama dibuat sebagai SUPER_ADMIN — ini "akun akar" yang nanti
  // dipakai buat login pertama kali dan membuat admin-admin lain (termasuk
  // SUPER_ADMIN lain kalau perlu) lewat POST /auth/admins.
  const admin = await prisma.adminUser.create({
    data: {
      name,
      email,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`Admin pertama berhasil dibuat: ${admin.email} (role: ${admin.role})`);
}

main()
  .catch((error) => {
    console.error('Seed gagal:', error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });