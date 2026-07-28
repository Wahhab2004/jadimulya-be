import { z } from 'zod';

// BARU — category sekarang relasi dinamis (tabel PotentialCategory), bukan
// enum tetap lagi. Divalidasi sebagai UUID; pengecekan apakah kategori itu
// benar-benar ada dilakukan di service (lewat foreign key constraint).

export const listPotensiSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    categoryId: z.string().uuid().optional(),
    highlightOnly: z.coerce.boolean().optional(),
  }),
});

export const potensiIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
});

export const createPotensiSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    name: z.string().min(3, 'Nama potensi minimal 3 karakter'),
    categoryId: z.string().uuid('Kategori wajib dipilih'),
    shortDesc: z.string().min(10, 'Deskripsi singkat minimal 10 karakter'),
    fullDesc: z.string().optional(),
    coverImage: z.string().url().optional(),
    isHighlight: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

export const updatePotensiSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createPotensiSchema.shape.body.partial(),
});

export type CreatePotensiInput = z.infer<typeof createPotensiSchema>['body'];
export type UpdatePotensiInput = z.infer<typeof updatePotensiSchema>['body'];

// ------------------------------------------------------------
// Kategori Potensi (BARU — dinamis, menggantikan enum PERTANIAN/PARIWISATA/UMKM)
// ------------------------------------------------------------

export const potensiCategoryIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
});

export const listPotensiCategorySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createPotensiCategorySchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
    isPublic: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

export const updatePotensiCategorySchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createPotensiCategorySchema.shape.body.partial(),
});

export type CreatePotensiCategoryInput = z.infer<typeof createPotensiCategorySchema>['body'];
export type UpdatePotensiCategoryInput = z.infer<typeof updatePotensiCategorySchema>['body'];