import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { deleteMediaHandler, listMediaHandler, uploadHandler } from './media.controller';

const router = Router();

router.get('/', requireAuth, listMediaHandler);
router.post('/', requireAuth, upload.single('file'), uploadHandler);
// BARU — sebelumnya tidak ada endpoint hapus sama sekali.
router.delete('/:id', requireAuth, deleteMediaHandler);

export default router;
