# .env.local Setup - Quick Reference

## 📍 File Location
```
/workspaces/zercel-project-management/.env.local
```

## 📋 Current Content

```env
# Supabase Configuration
# Get these values from your Supabase project dashboard
# https://supabase.com/dashboard

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: API Base URL (if using custom backend)
# VITE_API_BASE_URL=http://localhost:3000

# Optional: Authentication Mode (supabase or mock)
# VITE_AUTH_MODE=supabase
```

## 🔄 How to Update

### Option 1: Edit in VS Code
1. Open `.env.local` file
2. Replace `https://your-project.supabase.co` with your actual Supabase URL
3. Replace `your-anon-key-here` with your actual anon key
4. Save (Ctrl+S)
5. Restart dev server: `npm run dev`

### Option 2: Edit in Terminal
```bash
# Edit the file
nano .env.local

# Or use sed to replace (example):
sed -i 's|https://your-project.supabase.co|https://your-actual-project.supabase.co|g' .env.local
```

## 📥 Where to Get Your Credentials

### VITE_SUPABASE_URL
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (bottom left)
4. Click **API** tab
5. Copy **Project URL** under "Configuration"
6. Paste into `.env.local`

### VITE_SUPABASE_ANON_KEY
1. Same **Settings** → **API** page
2. Under "Project API keys"
3. Copy the **anon public** key (first one)
4. Paste into `.env.local`

## ✅ Example

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNDcwMDAwMCwiZXhwIjoxODMyNTAwMDAwfQ.1234567890abcdefghijklmnopqrstuvwxyz
```

## ⚠️ Important Notes

- ✅ Safe to expose: `VITE_SUPABASE_ANON_KEY` (it's public)
- ❌ Never expose: `VITE_SUPABASE_SERVICE_ROLE_KEY`
- ❌ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Must restart dev server after changes
- ✅ Check console for errors

## 🧪 Test After Setup

1. Run `npm run dev`
2. Go to http://localhost:5175
3. Click "Sign up here"
4. Create account with your email
5. Check email for verification link
6. Verify and login

## 🆘 Need Help?

See: `SUPABASE_CREDENTIALS_SETUP.md` for detailed instructions

---

**Status:** Ready for you to fill in your Supabase credentials! 🚀
