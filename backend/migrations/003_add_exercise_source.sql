ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'local' CHECK (source IN ('local', 'external'));
