import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createNewsSchema,
  listNewsSchema,
  newsIdParamSchema,
  newsSlugParamSchema,
  updateNewsSchema,
} from './news.schema';
import {
  createHandler,
  deleteHandler,
  getBySlugHandler,
  listAdminHandler,
  listPublicHandler,
  updateHandler,
} from './news.controller';

const router = Router();

// --- Publik (FR-PUB-01) ---
router.get('/', validate(listNewsSchema), listPublicHandler);
router.get('/:slug', validate(newsSlugParamSchema), getBySlugHandler);

// --- Admin (FR-ADM-06) ---
router.get('/admin/all', requireAuth, validate(listNewsSchema), listAdminHandler);
router.post('/admin', requireAuth, validate(createNewsSchema), createHandler);
router.patch('/admin/:id', requireAuth, validate(updateNewsSchema), updateHandler);
router.delete('/admin/:id', requireAuth, validate(newsIdParamSchema), deleteHandler);

export default router;
