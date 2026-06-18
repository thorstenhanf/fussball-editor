import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, display_name: user.display_name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich.' });
  }

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user) {
    return res.status(401).json({ error: 'E-Mail oder Passwort falsch.' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'E-Mail oder Passwort falsch.' });
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      role: user.role,
    },
  });
}

// Nur für Admins gedacht: neuen Trainer-Account anlegen.
// Es gibt bewusst keine offene Selbstregistrierung, da es sich um ein
// geschlossenes Trainerteam handelt.
export async function createUser(req, res) {
  const { email, password, display_name, role } = req.body;

  if (!email || !password || !display_name) {
    return res.status(400).json({ error: 'E-Mail, Passwort und Name erforderlich.' });
  }

  const password_hash = await bcrypt.hash(password, 12);

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, display_name, role, created_at`,
      [email, password_hash, display_name, role === 'admin' ? 'admin' : 'trainer']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'E-Mail ist bereits registriert.' });
    }
    throw err;
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
