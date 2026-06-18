// Einfacher Migrations-Runner: führt alle .sql-Dateien im migrations/-Ordner
// in alphabetischer Reihenfolge aus, sofern sie noch nicht angewendet wurden.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', '..', 'migrations');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function run() {
  await ensureMigrationsTable();

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const { rows } = await pool.query(
      'SELECT 1 FROM _migrations WHERE filename = $1',
      [file]
    );

    if (rows.length > 0) {
      console.log(`Übersprungen (bereits angewendet): ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`Wende Migration an: ${file}`);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`OK: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`Fehler bei Migration ${file}:`, err);
      process.exit(1);
    } finally {
      client.release();
    }
  }

  console.log('Alle Migrationen angewendet.');
  await pool.end();
}

run();
