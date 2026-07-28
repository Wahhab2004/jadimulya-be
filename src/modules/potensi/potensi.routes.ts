import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createPotensiCategorySchema,
  createPotensiSchema,
  listPotensiCategorySchema,
  listPotensiSchema,
  potensiCategoryIdParamSchema,
  potensiIdParamSchema,
  updatePotensiCategorySchema,
  updatePotensiSchema,
} from './potensi.schema';
import {
  createCategoryHandler,
  createHandler,
  deleteCategoryHandler,
  deleteHandler,
  getByIdHandler,
  listAdminHandler,
  listCategoriesAdminHandler,
  listCategoriesPublicHandler,
  listPublicHandler,
  updateCategoryHandler,
  updateHandler,
} from './potensi.controller';

const router = Router();

// --- Publik ---
router.get('/', validate(listPotensiSchema), listPublicHandler);
// BARU — kategori sekarang dinamis, publik butuh daftar kategori untuk
// filter/dropdown. PENTING: route ini harus di atas '/:id', kalau tidak
// '/kategori' akan ketangkep sebagai parameter :id.
router.get('/kategori', validate(listPotensiCategorySchema), listCategoriesPublicHandler);
router.get('/:id', validate(potensiIdParamSchema), getByIdHandler);

// --- Admin (FR-ADM-03) ---
router.get('/admin/all', requireAuth, listAdminHandler);
router.post('/admin', requireAuth, validate(createPotensiSchema), createHandler);
router.patch('/admin/:id', requireAuth, validate(updatePotensiSchema), updateHandler);
router.delete('/admin/:id', requireAuth, validate(potensiIdParamSchema), deleteHandler);

// BARU — CRUD kategori potensi (dinamis; admin bisa tambah/ubah/hapus sendiri,
// menggantikan enum tetap PERTANIAN/PARIWISATA/UMKM).
router.get('/admin/kategori', requireAuth, listCategoriesAdminHandler);
router.post(
  '/admin/kategori',
  requireAuth,
  validate(createPotensiCategorySchema),
  createCategoryHandler,
);
router.patch(
  '/admin/kategori/:id',
  requireAuth,
  validate(updatePotensiCategorySchema),
  updateCategoryHandler,
);
router.delete(
  '/admin/kategori/:id',
  requireAuth,
  validate(potensiCategoryIdParamSchema),
  deleteCategoryHandler,
);

export default router;
