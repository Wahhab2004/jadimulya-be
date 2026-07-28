import { OfficialTier } from '@prisma/client';
import { ApiError } from '../../common/ApiError';
import { prisma } from '../../config/prisma';
import { CreateOrganisasiInput, UpdateOrganisasiInput } from './organisasi.schema';

export async function listPublicOrganisasi(filter: { tier?: OfficialTier }) {
  return prisma.official.findMany({
    where: {
      isActive: true,
      ...(filter.tier ? { tier: filter.tier } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function getOrganisasiById(id: string) {
  const item = await prisma.official.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('Data organisasi tidak ditemukan');
  return item;
}

// --- Admin (FR-ADM-02) ---

export async function listAllOrganisasiForAdmin(filter: { tier?: OfficialTier }) {
  return prisma.official.findMany({
    where: {
      ...(filter.tier ? { tier: filter.tier } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function createOrganisasi(input: CreateOrganisasiInput) {
  return prisma.official.create({ data: input });
}

export async function updateOrganisasi(id: string, input: UpdateOrganisasiInput) {
  await getOrganisasiById(id);
  return prisma.official.update({ where: { id }, data: input });
}

export async function deleteOrganisasi(id: string) {
  await getOrganisasiById(id);
  await prisma.official.delete({ where: { id } });
}
