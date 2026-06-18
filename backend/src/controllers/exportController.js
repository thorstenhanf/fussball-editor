import { pool } from '../db/pool.js';
import { enqueueExportJob } from '../workers/exportQueue.js';

// Stößt den Export einer Übung als Video/GIF an.
// Der eigentliche Render-Vorgang läuft asynchron im Worker (Puppeteer + FFmpeg),
// damit die API-Anfrage nicht blockiert wird.
export async function requestExport(req, res) {
  const { id } = req.params;
  const { format = 'mp4' } = req.body; // 'mp4' oder 'gif'

  const { rows } = await pool.query('SELECT id, choreography, field_template FROM exercises WHERE id = $1', [id]);
  const exercise = rows[0];

  if (!exercise) {
    return res.status(404).json({ error: 'Übung nicht gefunden.' });
  }

  await pool.query(
    `UPDATE exercises SET export_status = 'pending', export_url = NULL WHERE id = $1`,
    [id]
  );

  await enqueueExportJob({
    exerciseId: exercise.id,
    format,
    choreography: exercise.choreography,
    fieldTemplate: exercise.field_template,
  });

  res.status(202).json({ status: 'pending' });
}

export async function getExportStatus(req, res) {
  const { id } = req.params;
  const { rows } = await pool.query(
    'SELECT export_status, export_url FROM exercises WHERE id = $1',
    [id]
  );

  if (!rows[0]) {
    return res.status(404).json({ error: 'Übung nicht gefunden.' });
  }

  res.json(rows[0]);
}
