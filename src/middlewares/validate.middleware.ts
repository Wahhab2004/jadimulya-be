import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

// Memvalidasi body/query/params sekaligus terhadap skema Zod modul terkait.
// Kalau gagal, ZodError dilempar dan ditangkap oleh error.middleware.ts.
export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  };
}
