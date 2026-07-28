import { Prisma } from '@prisma/client';
import { ApiError } from '../../common/ApiError';
import { prisma } from '../../config/prisma';
import {
  CreateAgeGroupInput,
  CreateDusunInput,
  CreateOccupationInput,
  ListDusunQuery,
  UpdateAgeGroupInput,
  UpdateDusunInput,
  UpdateOccupationInput,
} from './demografi.schema';

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

// ------------------------------------------------------------
// Ringkasan (BARU — dihitung otomatis dari DusunStat)
// ------------------------------------------------------------
// Sebelumnya ringkasan disimpan manual di tabel demographic_summary dan
// di-update lewat PATCH /admin/ringkasan. Sekarang totalPopulation,
// totalFamilies, maleCount, femaleCount dihitung langsung (agregasi) dari
// data per dusun setiap kali endpoint ini dipanggil, supaya selalu
// mencerminkan kondisi data dusun terkini tanpa perlu sinkronisasi manual.
// Tabel demographic_summary dibiarkan ada untuk kompatibilitas data lama
// (farmerCount/traderCount/dst, lihat schema.prisma), tapi tidak lagi jadi
// sumber untuk angka-angka total ini.

type RingkasanComputed = {
  totalPopulation: number;
  totalFamilies: number;
  maleCount: number;
  femaleCount: number;
  dataYear: number | null;
};

async function computeRingkasanFromDusun(dataYear?: number): Promise<RingkasanComputed> {
  let targetYear = dataYear;

  if (!targetYear) {
    const latestDusun = await prisma.dusunStat.findFirst({
      orderBy: { dataYear: 'desc' },
      select: { dataYear: true },
    });
    targetYear = latestDusun?.dataYear;
  }

  if (!targetYear) {
    return { totalPopulation: 0, totalFamilies: 0, maleCount: 0, femaleCount: 0, dataYear: null };
  }

  const agg = await prisma.dusunStat.aggregate({
    where: { dataYear: targetYear },
    _sum: { totalKK: true, maleCount: true, femaleCount: true },
  });

  const maleCount = agg._sum.maleCount ?? 0;
  const femaleCount = agg._sum.femaleCount ?? 0;
  const totalFamilies = agg._sum.totalKK ?? 0;

  return {
    totalPopulation: maleCount + femaleCount,
    totalFamilies,
    maleCount,
    femaleCount,
    dataYear: targetYear,
  };
}

export async function getRingkasanPublik(dataYear?: number) {
  const ringkasan = await computeRingkasanFromDusun(dataYear);

  if (ringkasan.dataYear === null) {
    throw ApiError.notFound('Data dusun belum tersedia untuk menghitung ringkasan demografi');
  }

  return ringkasan;
}

export async function listDusunPublik(filter: ListDusunQuery) {
  return prisma.dusunStat.findMany({
    where: {
      ...(filter.dataYear ? { dataYear: filter.dataYear } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { dusunName: 'asc' }],
  });
}

export async function getDusunById(id: string) {
  const item = await prisma.dusunStat.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('Data dusun tidak ditemukan');
  return item;
}

export async function createDusun(input: CreateDusunInput) {
  try {
    return await prisma.dusunStat.create({ data: input });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Data dusun untuk tahun tersebut sudah ada');
    }
    throw error;
  }
}

export async function updateDusun(id: string, input: UpdateDusunInput) {
  await getDusunById(id);
  try {
    return await prisma.dusunStat.update({ where: { id }, data: input });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Data dusun untuk tahun tersebut sudah ada');
    }
    throw error;
  }
}

export async function deleteDusun(id: string) {
  await getDusunById(id);
  await prisma.dusunStat.delete({ where: { id } });
}

// Dipakai oleh GET /demografi/admin/dusun — sebelumnya tidak ada endpoint
// listing untuk admin sama sekali (frontend admin panel gagal fetch karena
// route ini belum pernah dibuat).
export async function listDusunAdmin(filter: ListDusunQuery) {
  return listDusunPublik(filter);
}

// ------------------------------------------------------------
// Kelompok Usia (BARU)
// ------------------------------------------------------------

export async function listAgeGroups() {
  return prisma.ageGroupStat.findMany({
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });
}

export async function getAgeGroupById(id: string) {
  const item = await prisma.ageGroupStat.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('Data kelompok usia tidak ditemukan');
  return item;
}

export async function createAgeGroup(input: CreateAgeGroupInput) {
  try {
    return await prisma.ageGroupStat.create({ data: input });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Kelompok usia dengan label tersebut sudah ada');
    }
    throw error;
  }
}

export async function updateAgeGroup(id: string, input: UpdateAgeGroupInput) {
  await getAgeGroupById(id);
  try {
    return await prisma.ageGroupStat.update({ where: { id }, data: input });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Kelompok usia dengan label tersebut sudah ada');
    }
    throw error;
  }
}

export async function deleteAgeGroup(id: string) {
  await getAgeGroupById(id);
  await prisma.ageGroupStat.delete({ where: { id } });
}

// ------------------------------------------------------------
// Jenis Pekerjaan (BARU)
// ------------------------------------------------------------

export async function listOccupations() {
  return prisma.occupationStat.findMany({
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });
}

export async function getOccupationById(id: string) {
  const item = await prisma.occupationStat.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('Data jenis pekerjaan tidak ditemukan');
  return item;
}

export async function createOccupation(input: CreateOccupationInput) {
  try {
    return await prisma.occupationStat.create({ data: input });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Jenis pekerjaan dengan label tersebut sudah ada');
    }
    throw error;
  }
}

export async function updateOccupation(id: string, input: UpdateOccupationInput) {
  await getOccupationById(id);
  try {
    return await prisma.occupationStat.update({ where: { id }, data: input });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Jenis pekerjaan dengan label tersebut sudah ada');
    }
    throw error;
  }
}

export async function deleteOccupation(id: string) {
  await getOccupationById(id);
  await prisma.occupationStat.delete({ where: { id } });
}