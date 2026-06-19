import { Router } from 'express';
import { login, createUser, me } from '../controllers/authController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Express 4 fängt async-Fehler nicht automatisch auf → Wrapper nötig
const ac = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/login', ac(login));
router.get('/me', requireAuth, ac(me));

// Neue Trainer-Accounts dürfen nur von Admins angelegt werden
router.post('/users', requireAuth, requireAdmin, ac(createUser));

export default router;
