-- Task Comments Schema
-- Add this to your Supabase database to enable task discussions

CREATE TABLE IF NOT EXISTS public.task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  user_name text,
  user_email text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_edited boolean DEFAULT false
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON public.task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON public.task_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created_at ON public.task_comments(created_at DESC);

-- Add comments count to tasks for quick access
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0;

-- RLS Policies (if using RLS)
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- Allow users to read all comments
CREATE POLICY "Anyone can read task comments"
  ON public.task_comments FOR SELECT
  USING (true);

-- Allow authenticated users to insert comments
CREATE POLICY "Users can create task comments"
  ON public.task_comments FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update own comments"
  ON public.task_comments FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete own comments"
  ON public.task_comments FOR DELETE
  USING (auth.uid()::text = user_id);
