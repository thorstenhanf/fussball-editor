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

// Öffentliche Route für Share-Links — bewusst vor requireAuth platziert
router.get('/shared/:token', getSharedExercise);

router.use(requireAuth);

router.get('/', listExercises);
router.post('/', createExercise);
router.get('/:id', getExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

router.post('/:id/share', toggleShare);
router.post('/:id/export', requestExport);
router.get('/:id/export', getExportStatus);

export default router;
