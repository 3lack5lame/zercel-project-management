-- Minimal schema for E2E testing
-- Run this in your Supabase SQL editor or via psql against your DB

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id text,
  description text,
  repo_owner text,
  repo_name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  assigned_to text,
  status text DEFAULT 'todo',
  priority text DEFAULT 'medium',
  complexity text DEFAULT 'medium',
  epic text,
  dependencies jsonb DEFAULT '[]'::jsonb,
  required_skills jsonb DEFAULT '[]'::jsonb,
  estimated_hours integer DEFAULT 8,
  "order" integer DEFAULT 0,
  source_file text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Note: If you have Row Level Security (RLS) enabled, adjust policies
-- so the anon/public key can insert rows for testing, or run this
-- as an authenticated RPC / server-side migration.
