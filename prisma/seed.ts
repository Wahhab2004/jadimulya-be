import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // --- Admin default untuk development ---
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@jadimulya.desa.id' },
    update: {},
    create: {
      name: 'Admin Desa Jadimulya',
      email: 'admin@jadimulya.desa.id',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // --- Profil desa dasar ---
  await prisma.villageProfile.upsert({
    where: { id: 'default-profile' },
    update: {},
    create: {
      id: 'default-profile',
      villageName: 'Jadimulya',
      district: '(isi kecamatan)',
      areaSize: 0,
    },
  });

  console.log('✅ Seed selesai. Login dev: admin@jadimulya.desa.id / ChangeMe123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
