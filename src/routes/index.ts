import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import organisasiRoutes from '../modules/organisasi/organisasi.routes';
import potensiRoutes from '../modules/potensi/potensi.routes';
import sejarahRoutes from '../modules/sejarah/sejarah.routes';
import demografiRoutes from '../modules/demografi/demografi.routes';
import newsRoutes from '../modules/news/news.routes';
import mediaRoutes from '../modules/media/media.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/organisasi', organisasiRoutes);
router.use('/potensi', potensiRoutes);
router.use('/sejarah', sejarahRoutes);
router.use('/demografi', demografiRoutes);
router.use('/news', newsRoutes);
router.use('/media', mediaRoutes);

export default router;
