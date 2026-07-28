import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createOrganisasiSchema,
  listOrganisasiSchema,
  organisasiIdParamSchema,
  updateOrganisasiSchema,
} from './organisasi.schema';
import {
  createHandler,
  deleteHandler,
  getByIdHandler,
  listAdminHandler,
  listPublicHandler,
  updateHandler,
} from './organisasi.controller';

const router = Router();

// --- Publik (FR-PUB-02) ---
router.get('/', validate(listOrganisasiSchema), listPublicHandler);
router.get('/:id', validate(organisasiIdParamSchema), getByIdHandler);

// --- Admin (FR-ADM-02) ---
router.get('/admin/all', requireAuth, validate(listOrganisasiSchema), listAdminHandler);
router.post('/admin', requireAuth, validate(createOrganisasiSchema), createHandler);
router.patch('/admin/:id', requireAuth, validate(updateOrganisasiSchema), updateHandler);
router.delete('/admin/:id', requireAuth, validate(organisasiIdParamSchema), deleteHandler);

export default router;
