-- SV Enkenbach Trainer-Tool – initiales Datenbankschema
-- PostgreSQL 15+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- Benutzer (Trainerteam)
-- ─────────────────────────────────────────────
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name  TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'trainer' CHECK (role IN ('admin', 'trainer')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Kategorien (Themengebiete) — frei verwaltbar, nicht hart codiert
-- ─────────────────────────────────────────────
CREATE TABLE categories (
    id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name  TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#2563eb'
);

INSERT INTO categories (name) VALUES
    ('Passspiel'),
    ('Abschluss'),
    ('Dribbling'),
    ('Standardsituationen'),
    ('Pressing / Gegenpressing'),
    ('Spielaufbau'),
    ('Kondition'),
    ('Torwarttraining');

-- ─────────────────────────────────────────────
-- Übungen
-- ─────────────────────────────────────────────
CREATE TABLE exercises (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title            TEXT NOT NULL,
    description      TEXT,
    age_group        TEXT,                 -- z.B. "U13", "Senioren", "Alle"
    duration_minutes INTEGER,
    field_template   TEXT NOT NULL DEFAULT 'vollfeld_hoch',
    choreography     JSONB NOT NULL DEFAULT '{"objects": [], "keyframes": []}',
    thumbnail_url    TEXT,

    -- Sharing
    share_token      UUID UNIQUE DEFAULT uuid_generate_v4(),
    share_enabled    BOOLEAN NOT NULL DEFAULT false,

    -- Export
    export_status    TEXT DEFAULT NULL CHECK (export_status IN (NULL, 'pending', 'processing', 'done', 'failed')),
    export_url       TEXT,

    created_by       UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exercises_created_by ON exercises(created_by);
CREATE INDEX idx_exercises_share_token ON exercises(share_token);

-- Viele-zu-viele: Übung <-> Kategorie (eine Übung kann mehreren Themen zugeordnet sein)
CREATE TABLE exercise_categories (
    exercise_id  UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    category_id  UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (exercise_id, category_id)
);

-- Freie Tags zusätzlich zu Kategorien
CREATE TABLE tags (
    id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE exercise_tags (
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    tag_id      UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (exercise_id, tag_id)
);

-- updated_at automatisch pflegen
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_exercises_updated_at
BEFORE UPDATE ON exercises
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
