import { ApiError } from '../../common/ApiError';
import { prisma } from '../../config/prisma';
import {
  CreateMilestoneInput,
  CreateNarasiInput,
  ListMilestoneQuery,
  UpdateMilestoneInput,
  UpdateNarasiInput,
} from './sejarah.schema';

export async function listNarasiPublik() {
  return prisma.historyNarrative.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function getNarasiById(id: string) {
  const item = await prisma.historyNarrative.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('Narasi sejarah tidak ditemukan');
  return item;
}

export async function listMilestonePublik(filter: ListMilestoneQuery) {
  return prisma.historyMilestone.findMany({
    where: {
      ...(filter.year ? { year: filter.year } : {}),
    },
    orderBy: [{ year: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function getMilestoneById(id: string) {
  const item = await prisma.historyMilestone.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('Milestone sejarah tidak ditemukan');
  return item;
}

// --- Admin (FR-ADM-04) ---

export async function createNarasi(input: CreateNarasiInput) {
  return prisma.historyNarrative.create({ data: input });
}

export async function updateNarasi(id: string, input: UpdateNarasiInput) {
  await getNarasiById(id);
  return prisma.historyNarrative.update({ where: { id }, data: input });
}

export async function deleteNarasi(id: string) {
  await getNarasiById(id);
  await prisma.historyNarrative.delete({ where: { id } });
}

export async function createMilestone(input: CreateMilestoneInput) {
  return prisma.historyMilestone.create({ data: input });
}

export async function updateMilestone(id: string, input: UpdateMilestoneInput) {
  await getMilestoneById(id);
  return prisma.historyMilestone.update({ where: { id }, data: input });
}

export async function deleteMilestone(id: string) {
  await getMilestoneById(id);
  await prisma.historyMilestone.delete({ where: { id } });
}
