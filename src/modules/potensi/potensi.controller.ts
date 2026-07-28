import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { sendCreated, sendSuccess } from '../../common/ApiResponse';
import * as potensiService from './potensi.service';

export const listPublicHandler = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
  const highlightOnly = req.query.highlightOnly === 'true';
  const data = await potensiService.listPublicPotensi({ categoryId, highlightOnly });
  sendSuccess(res, data);
});

export const getByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await potensiService.getPotensiById(req.params.id);
  sendSuccess(res, data);
});

export const listAdminHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await potensiService.listAllPotensiForAdmin();
  sendSuccess(res, data);
});

export const createHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await potensiService.createPotensi(req.body);
  sendCreated(res, data);
});

export const updateHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await potensiService.updatePotensi(req.params.id, req.body);
  sendSuccess(res, data, 'Potensi berhasil diperbarui');
});

export const deleteHandler = asyncHandler(async (req: Request, res: Response) => {
  await potensiService.deletePotensi(req.params.id);
  sendSuccess(res, null, 'Potensi berhasil dihapus');
});

// --- Kategori Potensi (BARU) ---
// Sebelumnya category adalah enum tetap (PERTANIAN/PARIWISATA/UMKM) yang
// butuh migrasi kode tiap kali mau nambah pilihan. Sekarang kategori adalah
// data dinamis yang bisa ditambah/ubah/hapus admin sendiri lewat endpoint ini.

export const listCategoriesPublicHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await potensiService.listPotensiCategories({ publicOnly: true });
  sendSuccess(res, data);
});

export const listCategoriesAdminHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await potensiService.listPotensiCategoriesForAdmin();
  sendSuccess(res, data);
});

export const createCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await potensiService.createPotensiCategory(req.body);
  sendCreated(res, data, 'Kategori potensi berhasil dibuat');
});

export const updateCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await potensiService.updatePotensiCategory(req.params.id, req.body);
  sendSuccess(res, data, 'Kategori potensi berhasil diperbarui');
});

export const deleteCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  await potensiService.deletePotensiCategory(req.params.id);
  sendSuccess(res, null, 'Kategori potensi berhasil dihapus');
});