import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import exerciseRoutes from './routes/exercises.js';
import categoryRoutes from './routes/categories.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '5mb' })); // Choreografie-JSON kann größer werden

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/categories', categoryRoutes);

// Zentrale Fehlerbehandlung
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Interner Serverfehler.' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend läuft auf Port ${port}`);
});
