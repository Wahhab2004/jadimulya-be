import { Prisma } from '@prisma/client';
import { ApiError } from '../../common/ApiError';
import { prisma } from '../../config/prisma';
import {
  CreatePotensiCategoryInput,
  CreatePotensiInput,
  UpdatePotensiCategoryInput,
  UpdatePotensiInput,
} from './potensi.schema';

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function isForeignKeyError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';
}

// ------------------------------------------------------------
// Potensi
// ------------------------------------------------------------

export async function listPublicPotensi(filter: { categoryId?: string; highlightOnly?: boolean }) {
  return prisma.potential.findMany({
    where: {
      isActive: true,
      // isPublic di level kategori tetap dipaksa true walaupun categoryId
      // dikirim eksplisit lewat query string — supaya publik tidak bisa
      // "menembus" kategori yang sengaja disembunyikan admin (isPublic: false).
      category: {
        isPublic: true,
        ...(filter.categoryId ? { id: filter.categoryId } : {}),
      },
      ...(filter.highlightOnly ? { isHighlight: true } : {}),
    },
    orderBy: { sortOrder: 'asc' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
  });
}

export async function getPotensiById(id: string) {
  const item = await prisma.potential.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
  });
  if (!item) throw ApiError.notFound('Potensi tidak ditemukan');
  return item;
}

// --- Admin (FR-ADM-03) ---

export async function listAllPotensiForAdmin() {
  return prisma.potential.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { category: true },
  });
}

export async function createPotensi(input: CreatePotensiInput) {
  try {
    return await prisma.potential.create({ data: input });
  } catch (error) {
    if (isForeignKeyError(error)) {
      throw ApiError.badRequest('Kategori yang dipilih tidak ditemukan');
    }
    throw error;
  }
}

export async function updatePotensi(id: string, input: UpdatePotensiInput) {
  await getPotensiById(id); // memastikan ada, melempar 404 kalau tidak
  try {
    return await prisma.potential.update({ where: { id }, data: input });
  } catch (error) {
    if (isForeignKeyError(error)) {
      throw ApiError.badRequest('Kategori yang dipilih tidak ditemukan');
    }
    throw error;
  }
}

export async function deletePotensi(id: string) {
  await getPotensiById(id);
  await prisma.potential.delete({ where: { id } });
}

// ------------------------------------------------------------
// Kategori Potensi (BARU — dinamis, menggantikan enum tetap
// PERTANIAN/PARIWISATA/UMKM. Admin sekarang bisa tambah/ubah/hapus
// kategori sendiri lewat endpoint ini, tanpa perlu migrasi kode.)
// ------------------------------------------------------------

export async function listPotensiCategories(filter: { publicOnly?: boolean } = {}) {
  return prisma.potentialCategory.findMany({
    where: filter.publicOnly ? { isPublic: true } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
}

export async function listPotensiCategoriesForAdmin() {
  return prisma.potentialCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
}

export async function getPotensiCategoryById(id: string) {
  const item = await prisma.potentialCategory.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound('Kategori potensi tidak ditemukan');
  return item;
}

export async function createPotensiCategory(input: CreatePotensiCategoryInput) {
  try {
    return await prisma.potentialCategory.create({ data: input });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Kategori dengan nama tersebut sudah ada');
    }
    throw error;
  }
}

export async function updatePotensiCategory(id: string, input: UpdatePotensiCategoryInput) {
  await getPotensiCategoryById(id);
  try {
    return await prisma.potentialCategory.update({ where: { id }, data: input });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw ApiError.conflict('Kategori dengan nama tersebut sudah ada');
    }
    throw error;
  }
}

export async function deletePotensiCategory(id: string) {
  await getPotensiCategoryById(id);

  // Cegah hapus kategori yang masih dipakai — categoryId di Potential wajib
  // diisi (NOT NULL), jadi hapus paksa akan bikin data potensi jadi yatim
  // atau gagal karena foreign key. Lebih baik dicegah lebih awal dengan
  // pesan yang jelas.
  const usageCount = await prisma.potential.count({ where: { categoryId: id } });
  if (usageCount > 0) {
    throw ApiError.conflict(
      `Kategori ini masih dipakai oleh ${usageCount} data potensi — pindahkan atau hapus data itu dulu sebelum menghapus kategori ini`,
    );
  }

  await prisma.potentialCategory.delete({ where: { id } });
}
