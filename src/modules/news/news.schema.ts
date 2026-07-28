import { z } from 'zod';

const categoryEnum = z.enum(['PEMBANGUNAN', 'KESEHATAN', 'PERTANIAN', 'WISATA', 'LAINNYA']);

export const listNewsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    category: categoryEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

export const newsSlugParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ slug: z.string().min(1, 'Slug wajib diisi') }),
});

export const newsIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
});

export const createNewsSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    title: z.string().min(5, 'Judul minimal 5 karakter'),
    category: categoryEnum,
    excerpt: z.string().optional(),
    content: z.string().min(20, 'Konten minimal 20 karakter'),
    coverImage: z.string().url().optional(),
    isPublished: z.boolean().optional(),
    publishedAt: z.coerce.date().optional(),
  }),
});

export const updateNewsSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createNewsSchema.shape.body.partial(),
});

export type ListNewsQuery = z.infer<typeof listNewsSchema>['query'];
export type CreateNewsInput = z.infer<typeof createNewsSchema>['body'];
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>['body'];
