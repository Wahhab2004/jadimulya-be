import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createMilestoneSchema,
  createNarasiSchema,
  listMilestoneSchema,
  listNarasiSchema,
  sejarahIdParamSchema,
  updateMilestoneSchema,
  updateNarasiSchema,
} from './sejarah.schema';
import {
  createMilestoneHandler,
  createNarasiHandler,
  deleteMilestoneHandler,
  deleteNarasiHandler,
  listMilestonePublikHandler,
  listNarasiPublikHandler,
  updateMilestoneHandler,
  updateNarasiHandler,
} from './sejarah.controller';

const router = Router();

// --- Publik (FR-PUB-04) ---
router.get('/narasi', validate(listNarasiSchema), listNarasiPublikHandler);
router.get('/milestone', validate(listMilestoneSchema), listMilestonePublikHandler);

// --- Admin (FR-ADM-04) ---
router.post('/admin/narasi', requireAuth, validate(createNarasiSchema), createNarasiHandler);
router.patch('/admin/narasi/:id', requireAuth, validate(updateNarasiSchema), updateNarasiHandler);
router.delete('/admin/narasi/:id', requireAuth, validate(sejarahIdParamSchema), deleteNarasiHandler);

router.post(
  '/admin/milestone',
  requireAuth,
  validate(createMilestoneSchema),
  createMilestoneHandler,
);
router.patch(
  '/admin/milestone/:id',
  requireAuth,
  validate(updateMilestoneSchema),
  updateMilestoneHandler,
);
router.delete(
  '/admin/milestone/:id',
  requireAuth,
  validate(sejarahIdParamSchema),
  deleteMilestoneHandler,
);

export default router;
