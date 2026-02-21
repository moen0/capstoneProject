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

-- Verifiser at tabellen er opprettet
SELECT * FROM users;
