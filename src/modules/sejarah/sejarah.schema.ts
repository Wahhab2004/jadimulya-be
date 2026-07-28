import { z } from 'zod';

export const sejarahIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
});

export const listNarasiSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createNarasiSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    sectionTitle: z.string().min(3, 'Judul bagian minimal 3 karakter'),
    content: z.string().min(10, 'Konten narasi minimal 10 karakter'),
    sortOrder: z.number().int().optional(),
  }),
});

export const updateNarasiSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createNarasiSchema.shape.body.partial(),
});

export const listMilestoneSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    year: z.coerce.number().int().optional(),
  }),
});

export const createMilestoneSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    year: z.number().int().min(1900, 'Tahun tidak valid'),
    title: z.string().min(3, 'Judul milestone minimal 3 karakter'),
    description: z.string().optional(),
    photoUrl: z.string().url().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

export const updateMilestoneSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createMilestoneSchema.shape.body.partial(),
});

export type CreateNarasiInput = z.infer<typeof createNarasiSchema>['body'];
export type UpdateNarasiInput = z.infer<typeof updateNarasiSchema>['body'];
export type ListMilestoneQuery = z.infer<typeof listMilestoneSchema>['query'];
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>['body'];
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>['body'];
