# Supabase Integration Guide

## 🚀 Quick Start Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free account)
3. Click "New Project"
4. Fill in:
   - **Name:** ProjectHub
   - **Database Password:** (Save this!)
   - **Region:** Choose closest to you
5. Click "Create New Project" (waits ~2 min)

### 2. Get Your Credentials

After project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (Supabase URL)
   - **anon public** (Public API Key)

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 4. Create Environment Variables

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Update AuthContext

The AuthContext is already updated to use Supabase. It will:
- Use Supabase authentication
- Store users in Supabase database
- Support email verification
- Real password reset emails
- Secure session management

## 📊 Database Schema

Supabase auto-creates an `auth.users` table with:
- `id` - UUID
- `email` - Email address
- `encrypted_password` - Hashed password
- `created_at` - Registration time
- `last_sign_in_at` - Last login

### Optional: Add User Profile Table

In Supabase SQL Editor, run:

```sql
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  name text,
  avatar text,
  created_at timestamp DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## ✅ Features Enabled

With Supabase integration:

✅ Real user authentication
✅ Email/password login
✅ Email verification
✅ Password reset via email
✅ Secure password hashing
✅ Session management
✅ JWT tokens
✅ Database persistence
✅ User profiles
✅ Row-level security

## 🚢 Deploy to InfinityFree

### Step 1: Build Project

```bash
npm run build
```

### Step 2: Upload to InfinityFree

1. Login to InfinityFree control panel
2. Go to **File Manager**
3. Delete everything in `public_html`
4. Upload all files from `dist` folder to `public_html`
5. Set index.html as default document

### Step 3: Configure InfinityFree

1. Go to **Settings** → **General**
2. Set **Document Root** to `/public_html`
3. Ensure `.htaccess` is in place

### Step 4: Test

Visit your InfinityFree domain
- Login should work (uses Supabase)
- Password reset sends real emails
- Users persist in database

## 🔐 Security Features

### Enabled by Default

- ✅ Password hashing (bcrypt)
- ✅ Email verification
- ✅ JWT tokens
- ✅ Row-level security
- ✅ HTTPS enforced
- ✅ Rate limiting on auth

### Configure in Supabase

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Go to **Authentication** → **Email Templates**
4. Customize password reset email

## 🔑 Important Notes

### Public API Key
- Safe to expose in frontend code
- Only allows specified operations
- Can't see passwords or sensitive data

### Supabase URL
- Also public (in browser network)
- Combined with Row-Level Security

### Rate Limiting
- 5 signup attempts per minute per IP
- 5 login attempts per minute per IP
- Configurable in auth settings

## 📧 Email Configuration

Supabase sends emails from:
- `noreply@mail.supabase.io` (free tier)

To send from custom email:
- Upgrade to paid plan
- Configure SMTP settings

## 💰 Pricing

**Free Tier (Perfect for InfinityFree):**
- 50,000 monthly active users
- Unlimited API requests
- 500MB database
- 1GB file storage
- Email auth

**Paid Tier:**
- Custom email domain
- More storage
- Priority support

## 🆘 Troubleshooting

### "Invalid credentials"
- Check `.env.local` variables
- Verify URL format
- Ensure API key is correct

### "Email confirmation not working"
- Supabase sends from `noreply@mail.supabase.io`
- Check spam folder
- Verify email in auth settings

### "User created but can't login"
- Email needs verification (check email)
- Or disable verification in auth settings

### "Build error about Supabase"
- Run `npm install @supabase/supabase-js`
- Clear node_modules: `rm -rf node_modules && npm install`

## 📚 Next Steps

1. ✅ Create Supabase account
2. ✅ Copy credentials to `.env.local`
3. ✅ Run `npm run dev` to test
4. ✅ Test signup and login
5. ✅ Build with `npm run build`
6. ✅ Deploy to InfinityFree
7. ✅ Test live app

## 🔗 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 📝 Environment Variables Reference

```env
# Required for Supabase
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional
VITE_SUPABASE_JWT_SECRET=from_settings_api
```

---

**Your app is now production-ready with real authentication!** 🎉
