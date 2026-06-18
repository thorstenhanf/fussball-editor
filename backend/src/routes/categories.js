import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name ist erforderlich.' });

  const { rows } = await pool.query(
    'INSERT INTO categories (name, color) VALUES ($1, COALESCE($2, $3)) RETURNING *',
    [name, color, '#2563eb']
  );
  res.status(201).json(rows[0]);
});

export default router;
