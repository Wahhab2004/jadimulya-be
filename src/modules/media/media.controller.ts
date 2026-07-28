import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { asyncHandler } from '../../common/asyncHandler';
import { sendCreated, sendSuccess } from '../../common/ApiResponse';
import { ApiError } from '../../common/ApiError';
import { prisma } from '../../config/prisma';

// FR-ADM-07 — file sudah divalidasi format & ukuran oleh upload.middleware.ts
// sebelum handler ini dipanggil.
export const uploadHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest('File tidak ditemukan pada request');
  }

  const media = await prisma.media.create({
    data: {
      fileName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      uploadedBy: req.admin?.sub,
    },
  });

  sendCreated(res, media, 'Media berhasil diunggah');
});

export const listMediaHandler = asyncHandler(async (_req: Request, res: Response) => {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  sendSuccess(res, media);
});

// BARU — FE punya tombol "Hapus" di daftar media, tapi endpoint ini belum
// pernah dibuat sama sekali sebelumnya.
export const deleteMediaHandler = asyncHandler(async (req: Request, res: Response) => {
  const media = await prisma.media.findUnique({ where: { id: req.params.id } });
  if (!media) {
    throw ApiError.notFound('Media tidak ditemukan');
  }

  await prisma.media.delete({ where: { id: media.id } });

  // Best-effort hapus file fisik dari disk. Diasumsikan file diunggah ke
  // folder `uploads/` relatif terhadap root project (mengikuti pola
  // `url: /uploads/${req.file.filename}` di uploadHandler) — SESUAIKAN
  // path ini kalau lokasi penyimpanan sebenarnya di upload.middleware.ts
  // berbeda. Kegagalan unlink tidak menggagalkan penghapusan data DB.
  const fileName = media.url.split('/').pop();
  if (fileName) {
    try {
      await fs.unlink(path.join(process.cwd(), 'uploads', fileName));
    } catch {
      // file mungkin sudah tidak ada, atau path berbeda — abaikan
    }
  }

  sendSuccess(res, null, 'Media berhasil dihapus');
});
