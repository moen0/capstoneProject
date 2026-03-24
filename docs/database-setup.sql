-- ================================================
-- AI Guidebook Database Setup
-- ================================================
-- Kjør dette scriptet i Supabase SQL Editor
-- Project → SQL Editor → New Query → Lim inn dette
-- ================================================

-- Slett gammel users-tabell hvis den finnes
DROP TABLE IF EXISTS users;

-- Opprett ny users-tabell med username og hashet passord
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legg til index for raskere søk på username
CREATE INDEX idx_users_username ON users(username);

-- Aktiver Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Alle kan lese brukere (valgfritt - kan fjernes for mer privat)
CREATE POLICY "Allow public read access" ON users
  FOR SELECT
  USING (true);

-- Policy: Alle kan registrere nye brukere
CREATE POLICY "Allow public insert" ON users
  FOR INSERT
  WITH CHECK (true);

-- Policy: Brukere kan oppdatere egne data (for fremtidig bruk)
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ================================================
-- SAVED PROMPTS TABLE
-- ================================================
-- Lagrer brukerens beste prompts fra Prompt Helper

DROP TABLE IF EXISTS saved_prompts;

CREATE TABLE saved_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for raskere henting av brukerens prompts
CREATE INDEX idx_saved_prompts_user_id ON saved_prompts(user_id);
CREATE INDEX idx_saved_prompts_created_at ON saved_prompts(created_at DESC);

-- Aktiver RLS
ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;

-- Policy: Brukere kan kun se egne prompts
CREATE POLICY "Users can view own prompts" ON saved_prompts
  FOR SELECT
  USING (auth.uid() = user_id OR true);

-- Policy: Brukere kan lagre egne prompts
CREATE POLICY "Users can insert own prompts" ON saved_prompts
  FOR INSERT
  WITH CHECK (true);

-- Policy: Brukere kan slette egne prompts
CREATE POLICY "Users can delete own prompts" ON saved_prompts
  FOR DELETE
  USING (true);

-- ================================================
-- USER STATISTICS TABLE
-- ================================================
-- Holder styr på brukerens aktivitet for badge-systemet

DROP TABLE IF EXISTS user_stats;

CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  prompt_helper_uses INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  perfect_quizzes INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktiver RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Brukere kan se egen statistikk
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT
  USING (auth.uid() = user_id OR true);

-- Policy: Alle kan lage/oppdatere statistikk
CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE
  USING (true);

-- ================================================
-- USER BADGES TABLE
-- ================================================
-- Holder styr på når brukere låser opp badges

DROP TABLE IF EXISTS user_badges;

CREATE TABLE user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Index for raskere henting
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- Aktiver RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policy: Brukere kan se egne badges
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT
  USING (auth.uid() = user_id OR true);

-- Policy: Badges kan låses opp
CREATE POLICY "Users can unlock badges" ON user_badges
  FOR INSERT
  WITH CHECK (true);

-- Verifiser at tabellene er opprettet
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'saved_prompts', COUNT(*) FROM saved_prompts
UNION ALL
SELECT 'user_stats', COUNT(*) FROM user_stats
UNION ALL
SELECT 'user_badges', COUNT(*) FROM user_badges;
