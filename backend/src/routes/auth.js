import { Router } from 'express';
import { login, createUser, me } from '../controllers/authController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAuth, me);

// Neue Trainer-Accounts dürfen nur von Admins angelegt werden
router.post('/users', requireAuth, requireAdmin, createUser);

export default router;
