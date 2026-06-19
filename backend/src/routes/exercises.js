import { Router } from 'express';
import {
  listExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  toggleShare,
  getSharedExercise,
} from '../controllers/exercisesController.js';
import { requestExport, getExportStatus } from '../controllers/exportController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Express 4 fängt async-Fehler nicht automatisch auf → Wrapper nötig
const ac = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Öffentliche Route für Share-Links — bewusst vor requireAuth platziert
router.get('/shared/:token', ac(getSharedExercise));

router.use(requireAuth);

router.get('/', ac(listExercises));
router.post('/', ac(createExercise));
router.get('/:id', ac(getExercise));
router.put('/:id', ac(updateExercise));
router.delete('/:id', ac(deleteExercise));

router.post('/:id/share', ac(toggleShare));
router.post('/:id/export', ac(requestExport));
router.get('/:id/export', ac(getExportStatus));

export default router;
