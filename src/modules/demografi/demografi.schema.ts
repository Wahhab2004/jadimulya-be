import { z } from 'zod';

export const demografiIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
});

// Ringkasan sekarang dihitung otomatis dari DusunStat (lihat demografi.service.ts),
// jadi tidak ada lagi endpoint update manual — hanya query dataYear opsional
// untuk melihat ringkasan tahun tertentu (default: tahun data dusun terbaru).
export const listRingkasanSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    dataYear: z.coerce.number().int().optional(),
  }),
});

export const listDusunSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    dataYear: z.coerce.number().int().optional(),
  }),
});

export const createDusunSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    dusunName: z.string().min(2, 'Nama dusun minimal 2 karakter'),
    totalKK: z.number().int().nonnegative(),
    maleCount: z.number().int().nonnegative(),
    femaleCount: z.number().int().nonnegative(),
    dataYear: z.number().int().min(1900).max(2100),
    sortOrder: z.number().int().optional(),
  }),
});

export const updateDusunSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createDusunSchema.shape.body.partial(),
});

export const listDusunAdminSchema = listDusunSchema;

// --- Kelompok Usia (BARU — sebelumnya tidak ada validasi/endpoint sama sekali) ---

export const listAgeGroupSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createAgeGroupSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    label: z.string().min(1, 'Rentang usia wajib diisi'),
    value: z.number().int().nonnegative(),
    sortOrder: z.number().int().optional(),
  }),
});

export const updateAgeGroupSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createAgeGroupSchema.shape.body.partial(),
});

// --- Jenis Pekerjaan (BARU — sebelumnya tidak ada validasi/endpoint sama sekali) ---

export const listOccupationSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createOccupationSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    label: z.string().min(1, 'Nama pekerjaan wajib diisi'),
    value: z.number().int().nonnegative(),
    sortOrder: z.number().int().optional(),
  }),
});

export const updateOccupationSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createOccupationSchema.shape.body.partial(),
});

export type ListDusunQuery = z.infer<typeof listDusunSchema>['query'];
export type CreateDusunInput = z.infer<typeof createDusunSchema>['body'];
export type UpdateDusunInput = z.infer<typeof updateDusunSchema>['body'];
export type CreateAgeGroupInput = z.infer<typeof createAgeGroupSchema>['body'];
export type UpdateAgeGroupInput = z.infer<typeof updateAgeGroupSchema>['body'];
export type CreateOccupationInput = z.infer<typeof createOccupationSchema>['body'];
export type UpdateOccupationInput = z.infer<typeof updateOccupationSchema>['body'];