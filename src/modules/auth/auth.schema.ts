import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
