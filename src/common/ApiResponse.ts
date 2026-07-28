import { Response } from 'express';

// Membungkus semua response sukses agar bentuknya seragam di seluruh API:
// { success: true, data, message }
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200,
): Response {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendCreated<T>(res: Response, data: T, message = 'Data berhasil dibuat'): Response {
  return sendSuccess(res, data, message, 201);
}
