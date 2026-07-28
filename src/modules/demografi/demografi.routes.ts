import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';

import { validate } from '../../middlewares/validate.middleware';
import {
  createAgeGroupSchema,
  createDusunSchema,
  createOccupationSchema,
  demografiIdParamSchema,
  listAgeGroupSchema,
  listDusunAdminSchema,
  listDusunSchema,
  listOccupationSchema,
  listRingkasanSchema,
  updateAgeGroupSchema,
  updateDusunSchema,
  updateOccupationSchema,
} from './demografi.schema';
import {
  createAgeGroupHandler,
  createDusunHandler,
  createOccupationHandler,
  deleteAgeGroupHandler,
  deleteDusunHandler,
  deleteOccupationHandler,
  getRingkasanPublikHandler,
  listAgeGroupsHandler,
  listDusunAdminHandler,
  listDusunPublikHandler,
  listOccupationsHandler,
  updateAgeGroupHandler,
  updateDusunHandler,
  updateOccupationHandler,
} from './demografi.controller';

const router = Router();

// --- Publik (FR-PUB-05) ---
router.get('/ringkasan', validate(listRingkasanSchema), getRingkasanPublikHandler);
router.get('/per-dusun', validate(listDusunSchema), listDusunPublikHandler);
// BARU — sebelumnya grafik usia & jenis pekerjaan tidak punya endpoint publik sama sekali.
router.get('/usia', validate(listAgeGroupSchema), listAgeGroupsHandler);
router.get('/pekerjaan', validate(listOccupationSchema), listOccupationsHandler);

// --- Admin (FR-ADM-05) ---
// BARU — ringkasan sekarang dihitung otomatis dari DusunStat (lihat
// demografi.service.ts), jadi tidak ada lagi PATCH manual di sini. Route ini
// hanya untuk admin panel melihat angka yang sama secara read-only.
router.get(
  '/admin/ringkasan',
  requireAuth,
  validate(listRingkasanSchema),
  getRingkasanPublikHandler,
);

// BARU — admin panel memanggil GET di path ini untuk listing, tapi route-nya belum pernah dibuat.
router.get('/admin/dusun', requireAuth, validate(listDusunAdminSchema), listDusunAdminHandler);
router.post('/admin/dusun', requireAuth, validate(createDusunSchema), createDusunHandler);
router.patch('/admin/dusun/:id', requireAuth, validate(updateDusunSchema), updateDusunHandler);
router.delete(
  '/admin/dusun/:id',
  requireAuth,
  validate(demografiIdParamSchema),
  deleteDusunHandler,
);

// BARU — CRUD kelompok usia, sebelumnya tidak ada sama sekali.
router.get('/admin/usia', requireAuth, validate(listAgeGroupSchema), listAgeGroupsHandler);
router.post('/admin/usia', requireAuth, validate(createAgeGroupSchema), createAgeGroupHandler);
router.patch('/admin/usia/:id', requireAuth, validate(updateAgeGroupSchema), updateAgeGroupHandler);
router.delete(
  '/admin/usia/:id',
  requireAuth,
  validate(demografiIdParamSchema),
  deleteAgeGroupHandler,
);

// BARU — CRUD jenis pekerjaan, sebelumnya tidak ada sama sekali.
router.get('/admin/pekerjaan', requireAuth, validate(listOccupationSchema), listOccupationsHandler);
router.post(
  '/admin/pekerjaan',
  requireAuth,
  validate(createOccupationSchema),
  createOccupationHandler,
);
router.patch(
  '/admin/pekerjaan/:id',
  requireAuth,
  validate(updateOccupationSchema),
  updateOccupationHandler,
);
router.delete(
  '/admin/pekerjaan/:id',
  requireAuth,
  validate(demografiIdParamSchema),
  deleteOccupationHandler,
);

export default router;
