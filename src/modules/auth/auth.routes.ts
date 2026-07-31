import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';
import { loginSchema, createAdminSchema } from './auth.schema';
import { createAdminHandler, loginHandler, meHandler, refreshHandler } from './auth.controller';

const router = Router();

router.post('/login', validate(loginSchema), loginHandler);
router.post('/refresh', refreshHandler);
router.get('/me', requireAuth, meHandler);
router.post('/admins', requireAuth, validate(createAdminSchema), createAdminHandler);

export default router;
