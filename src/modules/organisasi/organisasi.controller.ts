import { OfficialTier } from '@prisma/client';
import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { sendCreated, sendSuccess } from '../../common/ApiResponse';
import * as organisasiService from './organisasi.service';

export const listPublicHandler = asyncHandler(async (req: Request, res: Response) => {
  const tier = req.query.tier as OfficialTier | undefined;
  const data = await organisasiService.listPublicOrganisasi({ tier });
  sendSuccess(res, data);
});

export const getByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await organisasiService.getOrganisasiById(req.params.id);
  sendSuccess(res, data);
});

export const listAdminHandler = asyncHandler(async (req: Request, res: Response) => {
  const tier = req.query.tier as OfficialTier | undefined;
  const data = await organisasiService.listAllOrganisasiForAdmin({ tier });
  sendSuccess(res, data);
});

export const createHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await organisasiService.createOrganisasi(req.body);
  sendCreated(res, data);
});

export const updateHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await organisasiService.updateOrganisasi(req.params.id, req.body);
  sendSuccess(res, data, 'Data organisasi berhasil diperbarui');
});

export const deleteHandler = asyncHandler(async (req: Request, res: Response) => {
  await organisasiService.deleteOrganisasi(req.params.id);
  sendSuccess(res, null, 'Data organisasi berhasil dihapus');
});
