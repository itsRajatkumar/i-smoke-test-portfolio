-- ============================================================
-- Sonia Career Journey — Supabase schema
-- Run this in the Supabase SQL editor after creating a project.
-- ============================================================

-- Contacts table: stores contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Only the server (service_role key) can insert and read contacts
CREATE POLICY "Service role full access on contacts"
  ON contacts FOR ALL
  USING (auth.role() = 'service_role');


-- Events table: anonymous analytics (no PII)
CREATE TABLE IF NOT EXISTS events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event      TEXT NOT NULL CHECK (event IN (
    'chapter_enter',
    'chapter_dwell_ms',
    'station_open',
    'scroll_depth',
    'cta_click',
    'form_submit'
  )),
  payload    JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the anon key on the client)
CREATE POLICY "Anon can insert events"
  ON events FOR INSERT
  WITH CHECK (true);

-- Only service_role can read events (for the admin dashboard)
CREATE POLICY "Service role can read events"
  ON events FOR SELECT
  USING (auth.role() = 'service_role');


-- Indices for dashboard queries
CREATE INDEX IF NOT EXISTS idx_events_session  ON events (session_id);
CREATE INDEX IF NOT EXISTS idx_events_event    ON events (event);
CREATE INDEX IF NOT EXISTS idx_events_created  ON events (created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts (created_at);
