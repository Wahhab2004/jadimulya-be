import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { sendCreated, sendSuccess } from '../../common/ApiResponse';
import * as sejarahService from './sejarah.service';

export const listNarasiPublikHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await sejarahService.listNarasiPublik();
  sendSuccess(res, data);
});

export const listMilestonePublikHandler = asyncHandler(async (req: Request, res: Response) => {
  const year = req.query.year ? Number(req.query.year) : undefined;
  const data = await sejarahService.listMilestonePublik({ year });
  sendSuccess(res, data);
});

export const createNarasiHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await sejarahService.createNarasi(req.body);
  sendCreated(res, data, 'Narasi sejarah berhasil dibuat');
});

export const updateNarasiHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await sejarahService.updateNarasi(req.params.id, req.body);
  sendSuccess(res, data, 'Narasi sejarah berhasil diperbarui');
});

export const deleteNarasiHandler = asyncHandler(async (req: Request, res: Response) => {
  await sejarahService.deleteNarasi(req.params.id);
  sendSuccess(res, null, 'Narasi sejarah berhasil dihapus');
});

export const createMilestoneHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await sejarahService.createMilestone(req.body);
  sendCreated(res, data, 'Milestone sejarah berhasil dibuat');
});

export const updateMilestoneHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await sejarahService.updateMilestone(req.params.id, req.body);
  sendSuccess(res, data, 'Milestone sejarah berhasil diperbarui');
});

export const deleteMilestoneHandler = asyncHandler(async (req: Request, res: Response) => {
  await sejarahService.deleteMilestone(req.params.id);
  sendSuccess(res, null, 'Milestone sejarah berhasil dihapus');
});
