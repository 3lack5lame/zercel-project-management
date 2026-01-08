# Supabase Setup Guide

## 📋 Quick Setup

Your `.env.local` file is ready. Follow these steps to add your Supabase credentials:

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Sign In" or "Start your project" (free tier available)
3. Create a new project:
   - Organization: Create new or select existing
   - Project name: `project-management` (or any name)
   - Database password: Create strong password (save this!)
   - Region: Choose closest to your users
   - Pricing plan: **Free** (perfect for testing)

4. Wait for project to initialize (2-5 minutes)

### Step 2: Get Your Credentials

Once project is ready, in Supabase Dashboard:

1. **Get Supabase URL:**
   - Go to **Settings** → **API**
   - Copy the **Project URL** (looks like `https://your-project.supabase.co`)
   - Paste into `.env.local`: `VITE_SUPABASE_URL=`

2. **Get Anon Key:**
   - In same **Settings** → **API** page
   - Copy the **anon public** key (not service_role)
   - Paste into `.env.local`: `VITE_SUPABASE_ANON_KEY=`

### Step 3: Update .env.local

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT:**
- Never commit `.env.local` to git (already in `.gitignore`)
- Never share these keys in public
- The anon key is safe to expose (it's public anyway)

### Step 4: Setup Authentication in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Email** (enabled by default)
3. Go to **Email Templates** - can customize if desired
4. Go to **URL Configuration**:
   - Add your site URL:
     - Development: `http://localhost:5175`
     - Production: `https://your-domain.com`

### Step 5: Create Database Tables (Optional)

The app will work with just auth, but for projects/tasks storage:

1. Go to **SQL Editor**
2. Run this setup script:

```sql
-- Users table (auto-created by Supabase Auth)
-- No need to create, Supabase handles this

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'TODO',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS) - Optional but recommended
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Step 6: Test the Setup

1. Start your app:
   ```bash
   npm run dev
   ```

2. You'll see the login page
3. Click "Sign up here"
4. Create account with your email
5. You should receive confirmation email
6. Verify email and login

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] `.env.local` updated with your credentials
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] Email provider enabled in Supabase
- [ ] App starts without errors
- [ ] Can signup with real email
- [ ] Can login after signup
- [ ] Can logout successfully
- [ ] Session persists after refresh

## 🐛 Troubleshooting

### "Supabase client error"
- Check `.env.local` file exists and is readable
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Make sure no extra spaces around `=` sign

### "Invalid request"
- Check your credentials are from the correct Supabase project
- Verify project is running (check Supabase dashboard)
- Clear browser cache and try again

### "Email already exists"
- Supabase is working! You already created that account
- Use different email or reset in Supabase dashboard

### "Signup not working"
- Check email is valid
- Check password is at least 6 characters
- Check Supabase Email provider is enabled
- Check URL configuration includes your domain

### App still shows mock auth
- Make sure `.env.local` is in root directory
- Restart dev server after updating `.env.local`
- Check browser console for errors

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/connecting-to-postgres)

## 💡 What Gets Saved

Once you add your Supabase credentials, your app will:

✅ Create real user accounts  
✅ Send verification emails  
✅ Allow password reset (via email)  
✅ Persist user data permanently  
✅ Support multiple users  
✅ Provide database for projects/tasks  

## 🚀 Next Steps

1. Get Supabase credentials ← You are here
2. Update `.env.local` with your keys
3. Test signup/login
4. (Optional) Setup database tables
5. Deploy to InfinityFree or Vercel

---

**Questions?** Check `.env.local.example` for format reference or see `SUPABASE_SETUP.md` for detailed instructions.
