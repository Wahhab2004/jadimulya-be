import { z } from 'zod';

const tierEnum = z.enum(['KEPALA_DESA', 'SEKDES_BPD', 'STAFF']);

export const listOrganisasiSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    tier: tierEnum.optional(),
  }),
});

export const organisasiIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
});

export const createOrganisasiSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
    position: z.string().min(2, 'Jabatan minimal 2 karakter'),
    division: z.string().optional(),
    tier: tierEnum.optional(),
    photoUrl: z.string().url().optional(),
    email: z.string().email('Format email tidak valid').optional(),
    phone: z.string().min(8, 'Nomor telepon minimal 8 karakter').optional(),
    facebookUrl: z.string().url().optional(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateOrganisasiSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('ID tidak valid') }),
  body: createOrganisasiSchema.shape.body.partial(),
});

export type CreateOrganisasiInput = z.infer<typeof createOrganisasiSchema>['body'];
export type UpdateOrganisasiInput = z.infer<typeof updateOrganisasiSchema>['body'];
