import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import GitHubService from '../src/services/githubService.js';
import crypto from 'crypto';

dotenv.config({ path: './.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function ensureProject(userId) {
  const projectName = 'E2E Test Project';
  // Try to find an existing project for this user
  const { data: existing, error: getErr } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .eq('name', projectName)
    .limit(1)
    .maybeSingle();

  if (getErr) {
    console.warn('Could not query projects:', getErr.message || getErr);
  }

  if (existing) return existing;

  const { data, error } = await supabase.from('projects').insert([
    {
      name: projectName,
      user_id: userId,
      description: 'Temporary project for E2E test',
      // Optionally configure these to enable GitHub ops
      repo_owner: process.env.TEST_REPO_OWNER || null,
      repo_name: process.env.TEST_REPO_NAME || null,
    },
  ]).select().single();

  if (error) {
    console.error('Failed to create project:', error.message || error);
    return null;
  }

  return data;
}

async function run() {
  const userId = process.env.TEST_USER_ID || `e2e-${crypto.randomUUID()}`;
  console.log('Using user id:', userId);

  const project = await ensureProject(userId);
  if (!project) {
    console.error('No project available; aborting');
    process.exit(1);
  }

  console.log('Using project:', project.id, project.name, project.repo_owner, project.repo_name);

  const tasks = [
    {
      title: 'E2E: Initialize CI',
      description: 'Add CI workflow for tests',
      type: 'feature',
      complexity: 'medium',
      estimatedHours: 4,
      epic: 'CI',
      dependencies: [],
    },
    {
      title: 'E2E: Add README',
      description: 'Add project README with setup instructions',
      type: 'doc',
      complexity: 'easy',
      estimatedHours: 1,
      epic: 'Docs',
      dependencies: [],
    },
  ];

  // Insert tasks
  const { data: inserted, error: insertErr } = await supabase.from('tasks').insert(
    tasks.map((t) => ({
      ...t,
      project_id: project.id,
      assigned_to: userId,
      status: 'todo',
      priority: 'medium',
      required_skills: [],
      metadata: { source: 'e2e' },
    }))
  ).select();

  if (insertErr) {
    console.error('Task insert failed:', insertErr.message || insertErr);
    process.exit(1);
  }

  console.log(`Inserted ${inserted.length} tasks.`);

  // If GitHub token and project repo are available, run GitHub ops
  if (GITHUB_TOKEN && project.repo_owner && project.repo_name) {
    console.log('GitHub token and repo provided — creating branches and Codespaces');
    const gh = new GitHubService(GITHUB_TOKEN);

    for (const t of inserted) {
      const slug = (t.title || 'task').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0,50);
      const branchName = `task/${t.id}-${slug}`;
      try {
        await gh.createBranch(project.repo_owner, project.repo_name, branchName, 'main');
        console.log('Created branch', branchName);
      } catch (e) {
        console.warn('Branch creation failed for', branchName, e.message || e);
      }

      try {
        const cs = await gh.createCodespace(project.repo_owner, project.repo_name, branchName);
        console.log('Requested Codespace for', branchName, '=>', cs?.name || cs?.id || '(no name)');
      } catch (e) {
        console.warn('Codespace creation failed for', branchName, e.message || e);
      }
    }
  } else {
    console.log('Skipping GitHub ops — provide GITHUB_TOKEN and set project.repo_owner/repo_name to enable.');
  }

  console.log('E2E test finished successfully.');
  process.exit(0);
}

run().catch((err) => {
  console.error('E2E run failed', err);
  process.exit(1);
});
