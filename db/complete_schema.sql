-- ============================================================================
-- COMPLETE SUPABASE DATABASE SCHEMA
-- ============================================================================
-- This file creates all necessary tables for the project management application
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================================================
-- 1. PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  priority TEXT DEFAULT 'medium',
  progress INT DEFAULT 0,
  start_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 2. TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  type TEXT DEFAULT 'task',
  priority TEXT DEFAULT 'medium',
  complexity TEXT DEFAULT 'medium',
  estimated_hours INT,
  epic TEXT,
  dependencies TEXT,
  comments_count INT DEFAULT 0,
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 3. TEAM MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- ============================================================================
-- 4. TASK COMMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_edited BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 5. TASK ACTIVITY TABLE (Auto-tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  field_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_project_id ON team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- Task comments indexes
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created_at ON task_comments(created_at DESC);

-- Task activity indexes
CREATE INDEX IF NOT EXISTS idx_task_activity_task_id ON task_activity(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_created_at ON task_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_activity_user_id ON task_activity(user_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_activity ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: PROJECTS
-- ============================================================================

-- Users can view projects they own
CREATE POLICY projects_select_own ON projects
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert projects
CREATE POLICY projects_insert ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own projects
CREATE POLICY projects_update_own ON projects
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own projects
CREATE POLICY projects_delete_own ON projects
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES: TASKS
-- ============================================================================

-- Users can view tasks in their projects
CREATE POLICY tasks_select ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can insert tasks in their projects
CREATE POLICY tasks_insert ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can update tasks in their projects
CREATE POLICY tasks_update ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete tasks in their projects
CREATE POLICY tasks_delete ON tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES: TEAM MEMBERS
-- ============================================================================

-- Users can view team members of their projects
CREATE POLICY team_members_select ON team_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = team_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Project owners can insert team members
CREATE POLICY team_members_insert ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = team_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Project owners can delete team members
CREATE POLICY team_members_delete ON team_members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = team_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES: TASK COMMENTS
-- ============================================================================

-- Authenticated users can view comments
CREATE POLICY task_comments_select ON task_comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert comments
CREATE POLICY task_comments_insert ON task_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own comments
CREATE POLICY task_comments_update ON task_comments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY task_comments_delete ON task_comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES: TASK ACTIVITY
-- ============================================================================

-- Authenticated users can view activity
CREATE POLICY task_activity_select ON task_activity
  FOR SELECT
  TO authenticated
  USING (true);

-- System can insert activity (triggers)
CREATE POLICY task_activity_insert ON task_activity
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- TRIGGER FUNCTIONS FOR TASK COMMENTS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_task_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tasks SET comments_count = comments_count + 1
    WHERE id = NEW.task_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tasks SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.task_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_task_comments_count ON task_comments;
CREATE TRIGGER trigger_update_task_comments_count
  AFTER INSERT OR DELETE ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_task_comments_count();

-- ============================================================================
-- TRIGGER FUNCTIONS FOR TASK ACTIVITY LOGGING
-- ============================================================================

CREATE OR REPLACE FUNCTION log_task_creation()
RETURNS TRIGGER AS $$
DECLARE
  v_user_name TEXT;
  v_user_email TEXT;
BEGIN
  SELECT 
    COALESCE(raw_user_meta_data->>'name', 'Unknown'),
    COALESCE(email, '')
  INTO v_user_name, v_user_email
  FROM auth.users
  WHERE id = auth.uid();

  INSERT INTO task_activity (
    task_id, user_id, user_name, user_email,
    action_type, new_value, field_name
  ) VALUES (
    NEW.id,
    auth.uid()::text,
    COALESCE(v_user_name, 'Unknown'),
    COALESCE(v_user_email, ''),
    'created',
    NEW.title,
    'task'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_task_creation ON tasks;
CREATE TRIGGER trigger_log_task_creation
  AFTER INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_creation();

-- Status change trigger
CREATE OR REPLACE FUNCTION log_task_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_user_name TEXT;
  v_user_email TEXT;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    SELECT 
      COALESCE(raw_user_meta_data->>'name', 'System'),
      COALESCE(email, '')
    INTO v_user_name, v_user_email
    FROM auth.users
    WHERE id = auth.uid();

    INSERT INTO task_activity (
      task_id, user_id, user_name, user_email,
      action_type, old_value, new_value, field_name
    ) VALUES (
      NEW.id,
      auth.uid()::text,
      COALESCE(v_user_name, 'System'),
      COALESCE(v_user_email, ''),
      'status_changed',
      OLD.status,
      NEW.status,
      'status'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_task_status_change ON tasks;
CREATE TRIGGER trigger_log_task_status_change
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_status_change();

-- Title change trigger
CREATE OR REPLACE FUNCTION log_task_title_change()
RETURNS TRIGGER AS $$
DECLARE
  v_user_name TEXT;
  v_user_email TEXT;
BEGIN
  IF NEW.title IS DISTINCT FROM OLD.title THEN
    SELECT 
      COALESCE(raw_user_meta_data->>'name', 'System'),
      COALESCE(email, '')
    INTO v_user_name, v_user_email
    FROM auth.users
    WHERE id = auth.uid();

    INSERT INTO task_activity (
      task_id, user_id, user_name, user_email,
      action_type, old_value, new_value, field_name
    ) VALUES (
      NEW.id,
      auth.uid()::text,
      COALESCE(v_user_name, 'System'),
      COALESCE(v_user_email, ''),
      'title_changed',
      OLD.title,
      NEW.title,
      'title'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_task_title_change ON tasks;
CREATE TRIGGER trigger_log_task_title_change
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_title_change();

-- Description change trigger
CREATE OR REPLACE FUNCTION log_task_description_change()
RETURNS TRIGGER AS $$
DECLARE
  v_user_name TEXT;
  v_user_email TEXT;
BEGIN
  IF NEW.description IS DISTINCT FROM OLD.description THEN
    SELECT 
      COALESCE(raw_user_meta_data->>'name', 'System'),
      COALESCE(email, '')
    INTO v_user_name, v_user_email
    FROM auth.users
    WHERE id = auth.uid();

    INSERT INTO task_activity (
      task_id, user_id, user_name, user_email,
      action_type, old_value, new_value, field_name
    ) VALUES (
      NEW.id,
      auth.uid()::text,
      COALESCE(v_user_name, 'System'),
      COALESCE(v_user_email, ''),
      'description_changed',
      OLD.description,
      NEW.description,
      'description'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_task_description_change ON tasks;
CREATE TRIGGER trigger_log_task_description_change
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_description_change();

-- Comment activity trigger
CREATE OR REPLACE FUNCTION log_comment_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO task_activity (
      task_id, user_id, user_name, user_email,
      action_type, new_value, field_name
    ) VALUES (
      NEW.task_id,
      NEW.user_id,
      NEW.user_name,
      NEW.user_email,
      'commented',
      NEW.content,
      'comment'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_comment_activity ON task_comments;
CREATE TRIGGER trigger_log_comment_activity
  AFTER INSERT ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION log_comment_activity();

-- ============================================================================
-- SCHEMA SETUP COMPLETE
-- ============================================================================
-- All tables, indexes, RLS policies, and triggers are now created!
-- You can now use the application with full database support.
