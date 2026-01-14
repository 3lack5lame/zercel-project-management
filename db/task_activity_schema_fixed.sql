-- Create task_activity table to track all task changes
CREATE TABLE IF NOT EXISTS task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  field_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_task_activity_task_id ON task_activity(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_created_at ON task_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_activity_user_id ON task_activity(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE task_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all authenticated users to view activity
-- (activity is read-only and contains no sensitive data beyond task names)
CREATE POLICY task_activity_select ON task_activity
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Allow system to insert activity (no auth check needed for triggers)
CREATE POLICY task_activity_insert ON task_activity
  FOR INSERT
  WITH CHECK (true);

-- Trigger function to log task creation
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

-- Trigger for task creation
DROP TRIGGER IF EXISTS trigger_log_task_creation ON tasks;
CREATE TRIGGER trigger_log_task_creation
  AFTER INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_creation();

-- Trigger function to log status changes
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

-- Trigger for status changes
DROP TRIGGER IF EXISTS trigger_log_task_status_change ON tasks;
CREATE TRIGGER trigger_log_task_status_change
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_status_change();

-- Trigger function to log title changes
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

-- Trigger for title changes
DROP TRIGGER IF EXISTS trigger_log_task_title_change ON tasks;
CREATE TRIGGER trigger_log_task_title_change
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_title_change();

-- Trigger function to log description changes
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

-- Trigger for description changes
DROP TRIGGER IF EXISTS trigger_log_task_description_change ON tasks;
CREATE TRIGGER trigger_log_task_description_change
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_description_change();

-- Function to log comment activity
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

-- Trigger for comments
DROP TRIGGER IF EXISTS trigger_log_comment_activity ON task_comments;
CREATE TRIGGER trigger_log_comment_activity
  AFTER INSERT ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION log_comment_activity();
