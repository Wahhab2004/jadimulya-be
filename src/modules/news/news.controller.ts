import { NewsCategory } from '@prisma/client';
import { Request, Response } from 'express';
import { ApiError } from '../../common/ApiError';
import { sendCreated, sendSuccess } from '../../common/ApiResponse';
import { asyncHandler } from '../../common/asyncHandler';
import * as newsService from './news.service';

export const listPublicHandler = asyncHandler(async (req: Request, res: Response) => {
  const category = req.query.category as NewsCategory | undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const data = await newsService.listPublicNews({ category, page, limit });
  sendSuccess(res, data);
});

export const getBySlugHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await newsService.getPublicNewsBySlug(req.params.slug);
  sendSuccess(res, data);
});

export const listAdminHandler = asyncHandler(async (req: Request, res: Response) => {
  const category = req.query.category as NewsCategory | undefined;
  const data = await newsService.listAllNewsForAdmin({ category });
  sendSuccess(res, data);
});

export const createHandler = asyncHandler(async (req: Request, res: Response) => {
  const adminId = req.admin?.sub;
  if (!adminId) {
    throw ApiError.unauthorized('Token akses tidak valid');
  }

  const data = await newsService.createNews(req.body, adminId);
  sendCreated(res, data, 'Berita berhasil dibuat');
});

export const updateHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await newsService.updateNews(req.params.id, req.body);
  sendSuccess(res, data, 'Berita berhasil diperbarui');
});

export const deleteHandler = asyncHandler(async (req: Request, res: Response) => {
  await newsService.deleteNews(req.params.id);
  sendSuccess(res, null, 'Berita berhasil dihapus');
});
