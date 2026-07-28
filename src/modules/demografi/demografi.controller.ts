import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { sendCreated, sendSuccess } from '../../common/ApiResponse';
import * as demografiService from './demografi.service';

export const getRingkasanPublikHandler = asyncHandler(async (req: Request, res: Response) => {
  const dataYear = req.query.dataYear ? Number(req.query.dataYear) : undefined;
  const data = await demografiService.getRingkasanPublik(dataYear);
  sendSuccess(res, data);
});

export const listDusunPublikHandler = asyncHandler(async (req: Request, res: Response) => {
  const dataYear = req.query.dataYear ? Number(req.query.dataYear) : undefined;
  const data = await demografiService.listDusunPublik({ dataYear });
  sendSuccess(res, data);
});

export const createDusunHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await demografiService.createDusun(req.body);
  sendCreated(res, data, 'Data dusun berhasil dibuat');
});

export const updateDusunHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await demografiService.updateDusun(req.params.id, req.body);
  sendSuccess(res, data, 'Data dusun berhasil diperbarui');
});

export const deleteDusunHandler = asyncHandler(async (req: Request, res: Response) => {
  await demografiService.deleteDusun(req.params.id);
  sendSuccess(res, null, 'Data dusun berhasil dihapus');
});

export const listDusunAdminHandler = asyncHandler(async (req: Request, res: Response) => {
  const dataYear = req.query.dataYear ? Number(req.query.dataYear) : undefined;
  const data = await demografiService.listDusunAdmin({ dataYear });
  sendSuccess(res, data);
});

// --- Kelompok Usia (BARU) ---

export const listAgeGroupsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await demografiService.listAgeGroups();
  sendSuccess(res, data);
});

export const createAgeGroupHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await demografiService.createAgeGroup(req.body);
  sendCreated(res, data, 'Kelompok usia berhasil dibuat');
});

export const updateAgeGroupHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await demografiService.updateAgeGroup(req.params.id, req.body);
  sendSuccess(res, data, 'Kelompok usia berhasil diperbarui');
});

export const deleteAgeGroupHandler = asyncHandler(async (req: Request, res: Response) => {
  await demografiService.deleteAgeGroup(req.params.id);
  sendSuccess(res, null, 'Kelompok usia berhasil dihapus');
});

// --- Jenis Pekerjaan (BARU) ---

export const listOccupationsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const data = await demografiService.listOccupations();
  sendSuccess(res, data);
});

export const createOccupationHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await demografiService.createOccupation(req.body);
  sendCreated(res, data, 'Jenis pekerjaan berhasil dibuat');
});

export const updateOccupationHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await demografiService.updateOccupation(req.params.id, req.body);
  sendSuccess(res, data, 'Jenis pekerjaan berhasil diperbarui');
});

export const deleteOccupationHandler = asyncHandler(async (req: Request, res: Response) => {
  await demografiService.deleteOccupation(req.params.id);
  sendSuccess(res, null, 'Jenis pekerjaan berhasil dihapus');
});