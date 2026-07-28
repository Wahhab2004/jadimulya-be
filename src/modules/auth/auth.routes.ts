import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';
import { loginSchema } from './auth.schema';
import { loginHandler, meHandler, refreshHandler } from './auth.controller';

const router = Router();

router.post('/login', validate(loginSchema), loginHandler);
router.post('/refresh', refreshHandler);
router.get('/me', requireAuth, meHandler);

export default router;
